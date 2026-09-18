# Gallery.tsx — eine Stelle ändern

Heute gilt `is_hero` global: Wird ein Bild als Hero markiert, verlieren **alle**
anderen Bilder die Markierung — auch die des anderen Hauses. Bei zwei Häusern
hätte damit immer nur eines ein Hero-Bild.

## Suchen (in `setHeroMutation`, ca. Zeile 130)

```ts
  const setHeroMutation = useMutation({
    mutationFn: async (image: GalleryImage) => {
      // First, unset all hero images
      await supabase
        .from('gallery_images')
        .update({ is_hero: false })
        .eq('is_hero', true);

      // Then set the new hero
      const { error } = await supabase
        .from('gallery_images')
        .update({ is_hero: true })
        .eq('id', image.id);
      
      if (error) throw error;
    },
```

## Ersetzen durch

```ts
  const setHeroMutation = useMutation({
    mutationFn: async (image: GalleryImage) => {
      // Hero-Markierung nur innerhalb DIESES Hauses zurücksetzen, damit jedes
      // Haus sein eigenes Titelbild behält.
      let unsetQuery = supabase
        .from('gallery_images')
        .update({ is_hero: false })
        .eq('is_hero', true);

      if (image.house_id) {
        unsetQuery = unsetQuery.eq('house_id', image.house_id);
      } else {
        unsetQuery = unsetQuery.is('house_id', null);
      }
      await unsetQuery;

      // Then set the new hero
      const { error } = await supabase
        .from('gallery_images')
        .update({ is_hero: true })
        .eq('id', image.id);

      if (error) throw error;
    },
```

Sonst nichts an dieser Datei.
