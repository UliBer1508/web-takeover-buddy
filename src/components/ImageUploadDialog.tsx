import { useState, useCallback, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Upload, Loader2, X, ImagePlus } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";

interface Category {
  id: string;
  name: string;
  display_name: string;
}

interface Season {
  id: string;
  name: string;
  display_name: string;
}

interface FilePreview {
  file: File;
  preview: string;
  id: string;
}

interface ImageUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const ImageUploadDialog = ({ open, onOpenChange, onSuccess }: ImageUploadDialogProps) => {
  const [files, setFiles] = useState<FilePreview[]>([]);
  const [titlePrefix, setTitlePrefix] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [seasonId, setSeasonId] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // Fetch categories from database
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data as Category[];
    },
  });

  // Fetch seasons from database
  const { data: seasons = [] } = useQuery({
    queryKey: ['seasons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('seasons')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data as Season[];
    },
  });

  // Set default season to "all" when seasons are loaded
  useEffect(() => {
    if (seasons.length > 0 && !seasonId) {
      const allSeason = seasons.find(s => s.name === 'all');
      if (allSeason) {
        setSeasonId(allSeason.id);
      }
    }
  }, [seasons, seasonId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      addFiles(Array.from(selectedFiles));
    }
  };

  const addFiles = (newFiles: File[]) => {
    const previews: FilePreview[] = newFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
    }));
    setFiles((prev) => [...prev, ...previews]);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const toRemove = prev.find((f) => f.id === id);
      if (toRemove) {
        URL.revokeObjectURL(toRemove.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (droppedFiles.length > 0) {
      addFiles(droppedFiles);
    }
  }, []);

  const handleUpload = async () => {
    if (files.length === 0 || !categoryId || !seasonId) {
      toast({
        title: "Fehlende Angaben",
        description: "Bitte wählen Sie mindestens ein Bild, eine Kategorie und eine Jahreszeit.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress({ current: 0, total: files.length });

    let successCount = 0;
    let errorCount = 0;

    try {
      // Get current max sort_order
      const { data: maxOrderData } = await supabase
        .from('gallery_images')
        .select('sort_order')
        .order('sort_order', { ascending: false })
        .limit(1);

      let nextOrder = (maxOrderData?.[0]?.sort_order ?? 0) + 1;

      // Get category display name for title
      const selectedCategory = categories.find(c => c.id === categoryId);

      for (let i = 0; i < files.length; i++) {
        const { file } = files[i];
        setUploadProgress({ current: i + 1, total: files.length });

        try {
          // Generate unique filename
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

          // Upload to Storage
          const { error: uploadError } = await supabase.storage
            .from('gallery')
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          // Get public URL
          const { data: urlData } = supabase.storage
            .from('gallery')
            .getPublicUrl(fileName);

          // Generate title
          const title = files.length === 1 
            ? (titlePrefix || file.name.split('.')[0])
            : `${titlePrefix || selectedCategory?.display_name || 'Bild'} ${i + 1}`;

          // Insert metadata into database with foreign keys
          const { error: insertError } = await supabase
            .from('gallery_images')
            .insert({
              url: urlData.publicUrl,
              title,
              category_id: categoryId,
              season_id: seasonId,
              sort_order: nextOrder++,
            });

          if (insertError) throw insertError;
          successCount++;
        } catch (error: any) {
          console.error(`Error uploading ${file.name}:`, error);
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast({
          title: `${successCount} Bild${successCount > 1 ? 'er' : ''} hochgeladen`,
          description: errorCount > 0 
            ? `${errorCount} Bild${errorCount > 1 ? 'er' : ''} konnte${errorCount > 1 ? 'n' : ''} nicht hochgeladen werden.`
            : "Alle Bilder wurden erfolgreich zur Galerie hinzugefügt.",
          variant: errorCount > 0 ? "destructive" : "default",
        });
        onSuccess();
      } else {
        toast({
          title: "Fehler beim Hochladen",
          description: "Keine Bilder konnten hochgeladen werden.",
          variant: "destructive",
        });
      }

      // Reset form
      resetForm();
      onOpenChange(false);

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Fehler beim Hochladen",
        description: error.message || "Die Bilder konnten nicht hochgeladen werden.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress({ current: 0, total: 0 });
    }
  };

  const resetForm = () => {
    files.forEach((f) => URL.revokeObjectURL(f.preview));
    setFiles([]);
    setTitlePrefix("");
    setCategoryId("");
    // Reset season to "all"
    const allSeason = seasons.find(s => s.name === 'all');
    setSeasonId(allSeason?.id || "");
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bilder hochladen</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Drag & Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
              ${isDragging 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
              }
            `}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <input
              id="file-input"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <ImagePlus className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Bilder hierher ziehen oder <span className="text-primary font-medium">klicken</span> zum Auswählen
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Mehrere Bilder gleichzeitig möglich
            </p>
          </div>

          {/* Preview Grid */}
          {files.length > 0 && (
            <div className="space-y-2">
              <Label>{files.length} Bild{files.length > 1 ? 'er' : ''} ausgewählt</Label>
              <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
                {files.map((fp) => (
                  <div key={fp.id} className="relative aspect-square rounded-md overflow-hidden group">
                    <img
                      src={fp.preview}
                      alt="Vorschau"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(fp.id);
                      }}
                      className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Title Prefix */}
          <div className="space-y-2">
            <Label htmlFor="title">
              {files.length > 1 ? 'Titel-Präfix (wird nummeriert)' : 'Titel'}
            </Label>
            <Input
              id="title"
              value={titlePrefix}
              onChange={(e) => setTitlePrefix(e.target.value)}
              placeholder={files.length > 1 ? "z.B. Wohnzimmer" : "z.B. Wohnzimmer mit Kamin"}
            />
            {files.length > 1 && titlePrefix && (
              <p className="text-xs text-muted-foreground">
                Vorschau: "{titlePrefix} 1", "{titlePrefix} 2", ...
              </p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Kategorie</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Kategorie wählen" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.display_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Season */}
          <div className="space-y-2">
            <Label htmlFor="season">Jahreszeit</Label>
            <Select value={seasonId} onValueChange={setSeasonId}>
              <SelectTrigger>
                <SelectValue placeholder="Jahreszeit wählen" />
              </SelectTrigger>
              <SelectContent>
                {seasons.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.display_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Upload Progress */}
          {isUploading && uploadProgress.total > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Hochladen...</span>
                <span>{uploadProgress.current} von {uploadProgress.total}</span>
              </div>
              <Progress value={(uploadProgress.current / uploadProgress.total) * 100} />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isUploading}>
            Abbrechen
          </Button>
          <Button onClick={handleUpload} disabled={isUploading || files.length === 0 || !categoryId || !seasonId}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Wird hochgeladen...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                {files.length > 1 ? `${files.length} Bilder hochladen` : 'Hochladen'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageUploadDialog;
