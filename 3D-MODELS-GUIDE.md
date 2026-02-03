# Free 3D Sneaker Models - Download Guide

## Available Free Models for Your Gallery

### 1. **Air Jordan 1** by makoto (Sketchfab)
- **URL:** https://sketchfab.com/3d-models/air-jordan-1-a4b434181fbb48008ad460722fd53725
- **License:** CC Attribution
- **Polygons:** 59.5k triangles
- **Downloads:** 41.6k+
- **Quality:** High - Perfect for detailed viewing
- **File:** GLB format available
- **Recommended for:** Jordan/Off-White display

### 2. **Converse All Star Chuck Taylor** by alban (Sketchfab)
- **URL:** https://sketchfab.com/3d-models/converse-all-star-chuck-taylor-white-6b7fa321b838491fbea2a6afaffe85a4
- **License:** CC Attribution
- **Polygons:** 58.3k triangles  
- **Downloads:** 1.2k+
- **Quality:** Photogrammetry - Highly realistic
- **File:** GLB format
- **Recommended for:** Classic/Vintage display

### 3. **New Balance 574 Classic** by Andrea Spognetta (Sketchfab)
- **URL:** https://sketchfab.com/3d-models/used-new-balance-574-classic-free-f0aad4f64925479da3f607b186314eef
- **License:** CC Attribution-NonCommercial
- **Polygons:** 36.8k triangles
- **Downloads:** 15.3k+
- **Quality:** Photogrammetry with wear detail
- **File:** GLB format
- **Recommended for:** Vintage/Aimé Leon Dore display

### 4. **Generic Sneakers (5 Shoes Pack)** by Issa (Sketchfab)
- **URL:** https://sketchfab.com/3d-models/generic-sneakers-5-shoes-4315ca048b954be7abaca9fa1dfee785
- **License:** CC Attribution
- **Polygons:** 86.8k triangles (total)
- **Downloads:** 2.6k+
- **Quality:** Medium - 5 different styles
- **File:** GLB format
- **Recommended for:** Variety display

### 5. **Nike GLB** by Rajarajan.N (Sketchfab)
- **URL:** https://sketchfab.com/3d-models/nike-glb-5f7c56249bd24d069147bbb16cb3d4b5
- **License:** CC Attribution
- **Downloads:** 1.9k+
- **File:** GLB format
- **Recommended for:** Nike displays

### 6. **Sci-fi Sneaker** by Erdem Dağdelen (Sketchfab)
- **URL:** https://sketchfab.com/3d-models/sci-fi-sneaker-31032bcf56a44166afbb4e73ee3d7051
- **License:** CC Attribution
- **Polygons:** 88k triangles
- **Downloads:** 1.1k+
- **Quality:** High - Futuristic design
- **File:** GLB format
- **Recommended for:** Balenciaga/futuristic displays

### 7. **Vans Shoes Sneakers** (CGTrader)
- **URL:** https://www.cgtrader.com/free-3d-models/character/clothing/vans-shoes-sneakers
- **License:** Royalty Free
- **Formats:** .stl .fbx .obj
- **Recommended for:** Streetwear display

### 8. **Air Jordan Sneakers** (CGTrader)
- **URL:** https://www.cgtrader.com/free-3d-models/character/clothing/air-jordan-sneakers
- **License:** Royalty Free
- **Textures:** 4k
- **Formats:** Multiple
- **Recommended for:** Jordan collection

### 9. **DC Shoes Sneakers** (CGTrader)
- **URL:** https://www.cgtrader.com/free-3d-models/character/clothing/dc-shoes-044d131d-848b-4000-869f-63573ffa6eec
- **License:** Royalty Free
- **Recommended for:** Skate/street display

### 10. **Sneakers by Poly by Google**
- **URL:** https://poly.pizza/m/2cAXk_gG3Eh
- **License:** CC Attribution
- **Format:** OBJ/GLTF
- **Poly Count:** Low poly
- **Recommended for:** Basic/low-poly display

---

## How to Download and Use

### From Sketchfab:
1. Click on the model URL
2. Click "Download 3D Model" button
3. Select **glTF/GLB** format
4. Save to your `public/models/` directory
5. Rename to match your product reference

### From CGTrader:
1. Click "Free Download"
2. Select preferred format (GLB, FBX, or OBJ)
3. If OBJ format, convert to GLB using online converters or Blender
4. Place in `public/models/` directory

---

## Recommended Model Mapping for Your Gallery

| Product | Current Model | Recommended Free Model | Why |
|---------|---------------|----------------------|-----|
| Miu Miu x New Balance 530 | balenciaga-track.glb | New Balance 574 Classic | Most accurate |
| Adidas SL 72 OG | nike-sacai.glb | Generic Sneakers Pack | Variety available |
| LOEWE Flow Runner | rick-geobasket.glb | Sci-fi Sneaker | Futuristic design match |
| Wales Bonner x Samba | bape-shark.glb | Generic Sneakers Pack | Classic style |
| New Balance 550 | new-balance.glb | New Balance 574 Classic | Brand match |
| Air Jordan 1 x Off-White | off-white-jordan.glb | Air Jordan 1 | Perfect match |
| Adidas Gazelle | nike-sacai.glb | Generic Sneakers Pack | Classic runner style |
| Maison Margiela | bape-shark.glb | Converse Chuck Taylor | Minimalist white style |

---

## Conversion Tools (if needed)

If you download in OBJ/FBX format, convert to GLB:

### Online:
- **Sketchfab Converter:** https://sketchfab.com/tools
- **Online 3D Converter:** https://3d-convert.com/

### Using Blender:
1. Import OBJ/FBX file
2. File → Export → glTF 2.0 (.glb)
3. Check "Selected Objects" if needed
4. Export

### Using Command Line:
```bash
# Install gltf-pipeline
npm install -g gltf-pipeline

# Convert OBJ to GLB
gltf-pipeline -i model.obj -o model.glb
```

---

## File Size Optimization

Large model files will slow down your gallery. Optimize them:

### Using Blender:
1. Import the model
2. Select mesh → "Decimate" modifier
3. Set ratio to 0.5 (50% reduction)
4. Apply modifier
5. Export as GLB

### Target File Sizes:
- **High detail models:** 5-15 MB
- **Background models:** 1-5 MB
- **Total gallery load:** Under 100 MB recommended

---

## Quality Settings Updated

Your gallery now supports:
- **Closer zoom:** 2x closer than before
- **Wider zoom range:** 2-25 units
- **Better camera angle:** 38° FOV for detail
- **Smooth damping:** Better control
- **Detail view mode:** Click "VIEW DETAILS" for 2.2x scale

## Next Steps

1. Download the recommended models above
2. Place in `public/models/` directory
3. Update the `model` paths in `FashionShowcase.tsx`
4. Test with `bun run dev`
5. Build with `nix build . --impure`

## Performance Tips

- Use `drei`'s `useGLTF` with `preload()` for faster loading
- Consider lazy loading models not immediately visible
- Use lower-poly models for background items
- Enable Draco compression for smaller file sizes

---

**Note:** All models listed above are free to use with attribution. Always check the license before commercial use.
