
PokeToken Glow Pack v2
----------------------
• assets/avatars_main/lv01..lv30.png  — avatarai (skaidrūs PNG)
• assets/stake_monsters/lv01..lv30.png — stake kortelės
• assets/avatars_manifest.json — efektų/lygių žemėlapis
• react-snippets/AvatarAnimated.tsx, AvatarGrid.tsx, StakeCard.tsx, styles.css
• web-demo/index.html — greitas peržiūros puslapis

Integracija:
- Perkelk 'assets' į savo projektą (pvz., src/assets)
- Perkelk 'react-snippets' failus į src/components (ar kur patogu) ir importuok styles.css
- Naudok <AvatarAnimated src={...} phase="pikachu|legendary|aquado|ember|spark" />
- Norint pamatyti visus lygius: <AvatarGrid />
