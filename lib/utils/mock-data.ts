const descriptions = [
  "Özenle seçilmiş malzemelerle hazırlanan özel tarifimiz",
  "Şefimizin özel reçetesiyle hazırlanan enfes lezzet",
  "Taze malzemelerle günlük hazırlanan spesiyalimiz",
  "Geleneksel tariflerimizle harmanlanan eşsiz tat",
  "En kaliteli malzemelerle hazırlanan vazgeçilmez lezzet",
  "Özel soslarımızla tatlandırılmış muhteşem seçim",
  "Usta ellerden çıkan eşsiz bir gastronomi deneyimi",
  "Damak tadınıza hitap edecek özel bir seçenek"
];

let currentDescriptionIndex = 0;

export function getRandomDescription(): string {
  const description = descriptions[currentDescriptionIndex];
  currentDescriptionIndex = (currentDescriptionIndex + 1) % descriptions.length;
  return description;
}

export function getRandomCalories(): number {
  // Returns a random calorie value between 200-800 in steps of 50
  return Math.floor(Math.random() * 13) * 50 + 200;
}
