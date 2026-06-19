import type { FuneralHallDesign } from '@/types';

export const funeralHallStyles = ['traditional', 'modern', 'buddhist', 'christian', 'minimalist', 'nature'] as const;

const buildImageUrl = (prompt: string) => {
  const encodedPrompt = encodeURIComponent(prompt);
  return `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodedPrompt}&image_size=landscape_16_9`;
};

export const funeralHallDesigns: FuneralHallDesign[] = [
  {
    id: 'hall-001',
    name: '传统中式灵堂',
    style: 'traditional',
    imageUrl: buildImageUrl(
      'traditional Chinese funeral memorial hall interior, elegant red and gold color scheme, ornate wooden altar with incense burners, white chrysanthemum and lily flower arrangements, solemn and respectful atmosphere, high quality architectural photography, soft warm lighting'
    ),
    description: '庄严肃穆的传统中式灵堂，以红金配色为主，彰显传统文化底蕴，适合高龄长者的寿终正寝。',
    features: ['传统红金配色', '龙凤呈祥图案', '寿桃寿翁装饰', '传统八仙桌供台', '白菊白百合花艺'],
    suitableFor: '高龄长者、传统家庭',
    estimatedBudget: '中高',
    items: ['灵堂布置', '遗像相框', '供桌供品', '鲜花花艺', '蜡烛香炉', '挽联挽幛', '签到台'],
  },
  {
    id: 'hall-002',
    name: '现代简约灵堂',
    style: 'modern',
    imageUrl: buildImageUrl(
      'modern minimalist funeral memorial hall, clean white and light gray design, elegant flower arrangements with white roses, soft ambient lighting, contemporary interior design, serene and dignified atmosphere, high quality professional photography'
    ),
    description: '简洁大方的现代风格，以白灰色调为主，线条流畅，氛围宁静祥和，适合追求简约的家庭。',
    features: ['简约白灰配色', '现代几何线条', '柔和间接照明', '精致花艺点缀', '亚克力透明元素'],
    suitableFor: '中青年逝者、现代家庭',
    estimatedBudget: '中等',
    items: ['灵堂布置', '遗像相框', '现代花艺', 'LED蜡烛', '签到台', '纪念册', '音响设备'],
  },
  {
    id: 'hall-003',
    name: '佛教风格灵堂',
    style: 'buddhist',
    imageUrl: buildImageUrl(
      'Buddhist style funeral memorial hall, golden Buddha statue on altar, beautiful lotus flower arrangements, incense smoke, prayer flags, warm amber lighting, tranquil and serene atmosphere, temple-like interior design, peaceful spiritual ambiance'
    ),
    description: '以佛教元素为主题的灵堂布置，营造宁静祥和的氛围，帮助家属和亲友寄托哀思、祈福超度。',
    features: ['佛像供奉', '莲花造型花艺', '梵文经幡装饰', '佛乐背景音乐', '酥油灯祈福'],
    suitableFor: '佛教信众、虔诚家庭',
    estimatedBudget: '中等',
    items: ['佛像供奉', '莲花花艺', '酥油灯', '诵经台', '经幡装饰', '檀香', '超度牌位'],
  },
  {
    id: 'hall-004',
    name: '基督教风格灵堂',
    style: 'christian',
    imageUrl: buildImageUrl(
      'Christian funeral memorial service, elegant white lilies and cross decoration, simple and dignified setup, soft natural light, church-like atmosphere, white and light blue color scheme, peaceful and hopeful ambiance, high quality interior photography'
    ),
    description: '以基督教信仰为主题的灵堂布置，以白百合和十字架为主要元素，氛围庄严肃穆又充满盼望。',
    features: ['十字架装饰', '白百合主花艺', '圣经经文布置', '圣诗背景音乐', '天使造型元素'],
    suitableFor: '基督教信众、教友家庭',
    estimatedBudget: '中等',
    items: ['十字架', '白百合花艺', '圣经台', '蜡烛台', '纪念册', '圣诗本', '祈愿卡'],
  },
  {
    id: 'hall-005',
    name: '极简素雅灵堂',
    style: 'minimalist',
    imageUrl: buildImageUrl(
      'minimalist Japanese Zen inspired funeral memorial hall, monochrome white flowers in simple vase, natural wood furniture, washi paper elements, soft natural lighting, serene and peaceful atmosphere, elegant simplicity, high quality interior design'
    ),
    description: '受日式禅风启发的极简风格，以素白和原木色调为主，营造宁静致远的氛围，适合品味高雅的逝者。',
    features: ['素白主色调', '原木质感家具', '单支花材点缀', '枯山水元素', '柔和自然光线'],
    suitableFor: '品味高雅、文艺界人士',
    estimatedBudget: '中高',
    items: ['原木供台', '素白花艺', '和纸装饰', '香道器具', '纪念册', '水墨画', '风铃'],
  },
  {
    id: 'hall-006',
    name: '自然生态灵堂',
    style: 'nature',
    imageUrl: buildImageUrl(
      'natural eco-friendly funeral memorial hall, abundant green plants and foliage, wild white flowers, wooden and rattan furniture, organic design elements, garden-like peaceful atmosphere, biodegradable decorations, soft natural lighting'
    ),
    description: '以自然生态为主题的灵堂布置，大量使用绿植和野花，回归自然本真，适合热爱自然的逝者。',
    features: ['大量绿植点缀', '野花组合花艺', '原木藤编材质', '环保可降解材料', '自然鸟鸣音效'],
    suitableFor: '热爱自然、环保人士',
    estimatedBudget: '中高',
    items: ['绿植墙', '野花艺', '原木家具', '藤编装饰', '纪念树', '种子卡片', '自然音效'],
  },
];
