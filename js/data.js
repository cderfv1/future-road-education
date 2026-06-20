// ============================================
// 未来之路 · 教育路径模拟器 — 数据层
// 数据来源：用户上传Excel文件硬编码
// ============================================

const DATA = {
  // Sheet1: 各省升学率（31省）
  provinces: [
    { name: "上海", highSchoolRate: 0.574737, examCandidates: 6.30, bachelorEnrolled: 4.92, bachelorRate: 0.781, firstTierRate: 0.486, rate985: 0.052, rate211: 0.128 },
    { name: "北京", highSchoolRate: 0.630502, examCandidates: 7.89, bachelorEnrolled: 5.46, bachelorRate: 0.692, firstTierRate: 0.423, rate985: 0.041, rate211: 0.153 },
    { name: "黑龙江", highSchoolRate: 0.474490, examCandidates: 18.40, bachelorEnrolled: 12.45, bachelorRate: 0.687, firstTierRate: 0.308, rate985: 0.017, rate211: 0.052 },
    { name: "吉林", highSchoolRate: 0.538776, examCandidates: 12.35, bachelorEnrolled: 8.26, bachelorRate: 0.670, firstTierRate: 0.324, rate985: 0.018, rate211: 0.057 },
    { name: "贵州", highSchoolRate: 0.384695, examCandidates: 43.40, bachelorEnrolled: 28.81, bachelorRate: 0.664, firstTierRate: 0.262, rate985: 0.012, rate211: 0.057 },
    { name: "重庆", highSchoolRate: 0.530531, examCandidates: 37.20, bachelorEnrolled: 23.85, bachelorRate: 0.641, firstTierRate: 0.370, rate985: 0.021, rate211: 0.043 },
    { name: "天津", highSchoolRate: 0.620725, examCandidates: 74.00, bachelorEnrolled: 4.72, bachelorRate: 0.638, firstTierRate: 0.387, rate985: 0.036, rate211: 0.112 },
    { name: "内蒙古", highSchoolRate: 0.618756, examCandidates: 15.70, bachelorEnrolled: 9.76, bachelorRate: 0.622, firstTierRate: 0.271, rate985: 0.013, rate211: 0.048 },
    { name: "海南", highSchoolRate: 0.397655, examCandidates: 7.40, bachelorEnrolled: 4.24, bachelorRate: 0.573, firstTierRate: 0.240, rate985: 0.013, rate211: 0.048 },
    { name: "辽宁", highSchoolRate: 0.524623, examCandidates: 20.50, bachelorEnrolled: 11.69, bachelorRate: 0.570, firstTierRate: 0.289, rate985: 0.024, rate211: 0.068 },
    { name: "青海", highSchoolRate: 0.560748, examCandidates: 5.00, bachelorEnrolled: 2.77, bachelorRate: 0.554, firstTierRate: 0.427, rate985: 0.030, rate211: 0.117 },
    { name: "广西", highSchoolRate: 0.406728, examCandidates: 70.40, bachelorEnrolled: 38.85, bachelorRate: 0.552, firstTierRate: 0.174, rate985: 0.013, rate211: 0.049 },
    { name: "宁夏", highSchoolRate: 0.537173, examCandidates: 7.30, bachelorEnrolled: 3.89, bachelorRate: 0.533, firstTierRate: 0.279, rate985: 0.012, rate211: 0.045 },
    { name: "陕西", highSchoolRate: 0.533881, examCandidates: 28.15, bachelorEnrolled: 14.67, bachelorRate: 0.521, firstTierRate: 0.235, rate985: 0.021, rate211: 0.063 },
    { name: "山西", highSchoolRate: 0.469792, examCandidates: 32.50, bachelorEnrolled: 16.71, bachelorRate: 0.514, firstTierRate: 0.231, rate985: 0.008, rate211: 0.036 },
    { name: "江苏", highSchoolRate: 0.473473, examCandidates: 51.20, bachelorEnrolled: 25.90, bachelorRate: 0.506, firstTierRate: 0.267, rate985: 0.019, rate211: 0.055 },
    { name: "福建", highSchoolRate: 0.504597, examCandidates: 25.88, bachelorEnrolled: 12.90, bachelorRate: 0.500, firstTierRate: 0.247, rate985: 0.015, rate211: 0.046 },
    { name: "湖南", highSchoolRate: 0.496496, examCandidates: 53.80, bachelorEnrolled: 25.64, bachelorRate: 0.476, firstTierRate: 0.291, rate985: 0.015, rate211: 0.042 },
    { name: "广东", highSchoolRate: 0.458333, examCandidates: 78.40, bachelorEnrolled: 34.48, bachelorRate: 0.440, firstTierRate: 0.230, rate985: 0.019, rate211: 0.052 },
    { name: "甘肃", highSchoolRate: 0.491718, examCandidates: 23.24, bachelorEnrolled: 10.20, bachelorRate: 0.439, firstTierRate: 0.186, rate985: 0.011, rate211: 0.042 },
    { name: "湖北", highSchoolRate: 0.486842, examCandidates: 40.50, bachelorEnrolled: 17.42, bachelorRate: 0.430, firstTierRate: 0.216, rate985: 0.016, rate211: 0.046 },
    { name: "安徽", highSchoolRate: 0.431034, examCandidates: 54.25, bachelorEnrolled: 23.21, bachelorRate: 0.428, firstTierRate: 0.224, rate985: 0.013, rate211: 0.041 },
    { name: "江西", highSchoolRate: 0.457364, examCandidates: 49.42, bachelorEnrolled: 20.86, bachelorRate: 0.422, firstTierRate: 0.164, rate985: 0.010, rate211: 0.037 },
    { name: "云南", highSchoolRate: 0.367347, examCandidates: 39.93, bachelorEnrolled: 16.41, bachelorRate: 0.411, firstTierRate: 0.155, rate985: 0.009, rate211: 0.034 },
    { name: "山东", highSchoolRate: 0.428571, examCandidates: 86.70, bachelorEnrolled: 35.54, bachelorRate: 0.410, firstTierRate: 0.203, rate985: 0.014, rate211: 0.043 },
    { name: "四川", highSchoolRate: 0.380952, examCandidates: 69.80, bachelorEnrolled: 28.52, bachelorRate: 0.409, firstTierRate: 0.174, rate985: 0.011, rate211: 0.035 },
    { name: "河北", highSchoolRate: 0.444444, examCandidates: 75.32, bachelorEnrolled: 30.63, bachelorRate: 0.407, firstTierRate: 0.196, rate985: 0.012, rate211: 0.038 },
    { name: "河南", highSchoolRate: 0.396825, examCandidates: 131.00, bachelorEnrolled: 52.40, bachelorRate: 0.400, firstTierRate: 0.160, rate985: 0.009, rate211: 0.032 },
    { name: "浙江", highSchoolRate: 0.476190, examCandidates: 36.00, bachelorEnrolled: 14.04, bachelorRate: 0.390, firstTierRate: 0.205, rate985: 0.013, rate211: 0.039 },
    { name: "新疆", highSchoolRate: 0.408163, examCandidates: 22.93, bachelorEnrolled: 8.71, bachelorRate: 0.380, firstTierRate: 0.145, rate985: 0.008, rate211: 0.029 },
    { name: "西藏", highSchoolRate: 0.408163, examCandidates: 3.30, bachelorEnrolled: 1.22, bachelorRate: 0.370, firstTierRate: 0.121, rate985: 0.006, rate211: 0.024 }
  ],

  // 初中学校等级（仅保留名称，用于卡片展示和映射表索引）
  juniorSchoolLevels: [
    { name: '市重点初中', desc: '优质初中，升学竞争力强' },
    { name: '区重点初中', desc: '区级重点，升学竞争力中等偏上' },
    { name: '普通初中', desc: '普通初中，升学竞争力一般' }
  ],

  // 高中学校等级（仅保留名称，用于卡片展示和映射表索引）
  seniorSchoolLevels: [
    { name: '省级示范/顶尖市重点', desc: '顶尖高中，升学竞争力极强' },
    { name: '普通市重点', desc: '市级重点，升学竞争力较强' },
    { name: '区重点', desc: '区级重点，升学竞争力中等' },
    { name: '普通高中', desc: '普通高中，升学竞争力一般' }
  ],

  // ============================================
  // 排名区间映射表（核心算法数据）
  // 结构：校内排名百分比 → [省排名下限%, 省排名上限%]
  // ============================================

  // 高中阶段映射表（按 seniorSchoolLevels 索引对应）
  seniorRankMapping: {
    '省级示范/顶尖市重点': [
      { rank: 1,  low: 0.3,  high: 0.8 },
      { rank: 3,  low: 1.0,  high: 2.5 },
      { rank: 5,  low: 2.0,  high: 4.0 },
      { rank: 10, low: 5.0,  high: 8.0 },
      { rank: 20, low: 12.0, high: 18.0 },
      { rank: 30, low: 20.0, high: 28.0 },
      { rank: 50, low: 38.0, high: 48.0 },
      { rank: 70, low: 60.0, high: 68.0 },
      { rank: 90, low: 85.0, high: 88.0 }
    ],
    '普通市重点': [
      { rank: 1,  low: 0.8,  high: 1.5 },
      { rank: 3,  low: 2.5,  high: 4.5 },
      { rank: 5,  low: 4.0,  high: 7.0 },
      { rank: 10, low: 9.0,  high: 14.0 },
      { rank: 20, low: 18.0, high: 26.0 },
      { rank: 30, low: 28.0, high: 36.0 },
      { rank: 50, low: 48.0, high: 56.0 },
      { rank: 70, low: 68.0, high: 74.0 },
      { rank: 90, low: 88.0, high: 90.0 }
    ],
    '区重点': [
      { rank: 1,  low: 1.5,  high: 3.0 },
      { rank: 3,  low: 4.5,  high: 8.0 },
      { rank: 5,  low: 7.0,  high: 12.0 },
      { rank: 10, low: 14.0, high: 22.0 },
      { rank: 20, low: 26.0, high: 38.0 },
      { rank: 30, low: 36.0, high: 50.0 },
      { rank: 50, low: 56.0, high: 68.0 },
      { rank: 70, low: 74.0, high: 82.0 },
      { rank: 90, low: 90.0, high: 94.0 }
    ],
    '普通高中': [
      { rank: 1,  low: 6.0,  high: 10.0 },
      { rank: 3,  low: 10.0, high: 18.0 },
      { rank: 5,  low: 16.0, high: 26.0 },
      { rank: 10, low: 26.0, high: 38.0 },
      { rank: 20, low: 38.0, high: 52.0 },
      { rank: 30, low: 50.0, high: 62.0 },
      { rank: 50, low: 68.0, high: 78.0 },
      { rank: 70, low: 82.0, high: 88.0 },
      { rank: 90, low: 94.0, high: 97.0 }
    ]
  },

  // 初中阶段映射表（按 juniorSchoolLevels 索引对应）
  juniorRankMapping: {
    '市重点初中': [
      { rank: 1,  low: 0.8,  high: 1.5 },
      { rank: 3,  low: 2.5,  high: 4.5 },
      { rank: 5,  low: 4.0,  high: 7.0 },
      { rank: 10, low: 9.0,  high: 14.0 },
      { rank: 20, low: 18.0, high: 26.0 },
      { rank: 30, low: 28.0, high: 36.0 },
      { rank: 50, low: 48.0, high: 56.0 },
      { rank: 70, low: 68.0, high: 74.0 }
    ],
    '区重点初中': [
      { rank: 1,  low: 1.0,  high: 2.0 },
      { rank: 3,  low: 3.0,  high: 5.5 },
      { rank: 5,  low: 5.0,  high: 8.5 },
      { rank: 10, low: 10.0, high: 16.0 },
      { rank: 20, low: 20.0, high: 30.0 },
      { rank: 30, low: 30.0, high: 42.0 },
      { rank: 50, low: 50.0, high: 62.0 },
      { rank: 70, low: 70.0, high: 78.0 }
    ],
    '普通初中': [
      { rank: 1,  low: 1.5,  high: 3.0 },
      { rank: 3,  low: 4.5,  high: 8.0 },
      { rank: 5,  low: 7.0,  high: 12.0 },
      { rank: 10, low: 13.0, high: 20.0 },
      { rank: 20, low: 24.0, high: 34.0 },
      { rank: 30, low: 34.0, high: 48.0 },
      { rank: 50, low: 56.0, high: 68.0 },
      { rank: 70, low: 74.0, high: 82.0 }
    ]
  },

  // 高中等级推测比例（初中→高中预测用）
  highSchoolTierPrediction: [
    { name: '省级示范/顶尖市重点', maxRatio: 0.10, desc: '省重点高中' },
    { name: '普通市重点', maxRatio: 0.30, desc: '市重点高中' },
    { name: '区重点', maxRatio: 0.60, desc: '区重点高中' },
    { name: '普通高中', maxRatio: 1.00, desc: '普通高中' }
  ],

  // 大学档次判定（从高到低）
  universityTiers: [
    { key: 'rate985', name: '985院校', pathName: '普通985' },
    { key: 'rate211', name: '211院校', pathName: '211院校' },
    { key: 'firstTierRate', name: '一本院校', pathName: '普通一本' },
    { key: 'bachelorRate', name: '本科院校', pathName: '二本/民办本科' },
    { key: 'highSchoolRate', name: '大专', pathName: '高职/大专毕业' }
  ],

  // Sheet3: 2026年中国毕业生社会阶层与生存状态矩阵
  // 城市能级 × 学历层次 × 就业赛道 → 社会阶层与生存状态
  societyData: {
    matrix: [
      // ===== 一线城市（北上广深）=====
      { cityLevel: "一线", education: "二本/民办/大专", track: "体制外", startSalary: "4500-6500", age35Status: "频繁换工作，月薪8k-1.2w，随时面临35岁优化，生存焦虑感极强", housingStatus: "长期租房或远离市区的老破小（合租）", classLevel: "城市边缘漂族（底层中产预备）", entryTier: "第8层", ceilingTier: null, breakthroughProbability: "极低（<5%）", breakthroughPath: "转行销售爆单或赶上直播风口" },
      { cityLevel: "一线", education: "二本/民办/大专", track: "体制内", startSalary: "6000-8000", age35Status: "月薪1-1.5w，工作稳定但晋升缓慢，社交圈局限于体制内基层", housingStatus: "排队申请共有产权房或公租房，勉强立足", classLevel: "稳定型城市平民", entryTier: "第6层", ceilingTier: null, breakthroughProbability: "较低", breakthroughPath: "靠工龄和职级并行熬到副科" },
      { cityLevel: "一线", education: "普通一本/211", track: "体制外", startSalary: "10000-18000", age35Status: "月薪2.5w-4w，面临严重年龄焦虑，拼体力内卷，存款较多但不敢辞职", housingStatus: "凑齐6个钱包付首付，背负高额房贷（月供1.5w+）", classLevel: "高负债中产", entryTier: "第5层", ceilingTier: null, breakthroughProbability: "中等", breakthroughPath: "跳槽到独角兽或晋升中层管理（总监级）" },
      { cityLevel: "一线", education: "普通一本/211", track: "体制内", startSalary: "8000-12000", age35Status: "月薪2-3w（含公积金绩效），社会资源丰富，孩子入学无忧，受人尊敬", housingStatus: "靠体制内低息贷款和分房政策，置换市区商品房", classLevel: "权力关联型中产", entryTier: "第5层", ceilingTier: "第4层", breakthroughProbability: "较高", breakthroughPath: "处级干部或高级职称后，可触达第4层" },
      { cityLevel: "一线", education: "985/C9/清北", track: "体制外", startSalary: "25000-45000", age35Status: "年薪60-100w，但高强度透支，35岁面临'毕业'风险，需提前布局被动收入", housingStatus: "贷款买核心区千万房产，或全款买郊区", classLevel: "高薪焦虑精英", entryTier: "第4层", ceilingTier: null, breakthroughProbability: "较高", breakthroughPath: "成为高管或技术合伙人进入第4层" },
      { cityLevel: "一线", education: "985/C9/清北", track: "体制内", startSalary: "10000-15000", age35Status: "副处/正科级，掌握审批权或核心资源，政治前景广阔", housingStatus: "配租/配售政策性住房，或低息购买", classLevel: "政治新星预备役", entryTier: "第5层", ceilingTier: "第3层", breakthroughProbability: "极高（非线性）", breakthroughPath: "仕途顺利可跨越多个阶层" },
      // ===== 二线城市（省会/新一线）=====
      { cityLevel: "二线", education: "二本/民办/大专", track: "体制外", startSalary: "4000-5500", age35Status: "月薪6k-8k，勉强温饱，已婚已育后经济压力巨大", housingStatus: "租房，或靠父母在郊区付首付", classLevel: "城市奋斗底层", entryTier: "第7层", ceilingTier: null, breakthroughProbability: "低", breakthroughPath: "做小生意或成为金牌销售" },
      { cityLevel: "二线", education: "二本/民办/大专", track: "体制内", startSalary: "5000-6500", age35Status: "月薪8k-1.2w，本地人眼中的'好工作'，相亲市场硬通货", housingStatus: "公积金覆盖房贷，购买市区普通商品房", classLevel: "地方安逸中产", entryTier: "第6层", ceilingTier: null, breakthroughProbability: "中等偏上", breakthroughPath: "熬资历成为中层领导" },
      { cityLevel: "二线", education: "普通一本/211", track: "体制外", startSalary: "8000-12000", age35Status: "月薪1.5-2.5w，工作稳定（国企）或内卷（大厂分部），买车自由", housingStatus: "工作5-8年置换核心区100平以上改善房", classLevel: "城市核心中产", entryTier: "第5层", ceilingTier: null, breakthroughProbability: "中等", breakthroughPath: "成为区域负责人或技术专家" },
      { cityLevel: "二线", education: "普通一本/211", track: "体制内", startSalary: "7000-9000", age35Status: "月薪1.5-2w，掌握本地医疗/教育资源，社会地位高，隐形福利多", housingStatus: "单位团购房或低价集资房，多套房持有者", classLevel: "地方实力派", entryTier: "第5层", ceilingTier: "第4层", breakthroughProbability: "高", breakthroughPath: "实权处级或科室主任后，在本地可呼风唤雨" },
      { cityLevel: "二线", education: "985/C9/清北", track: "体制外", startSalary: "15000-25000", age35Status: "月薪3-5w，成为公司中层骨干，在本城市属于高收入人群", housingStatus: "全款或极少贷款购买高端住宅", classLevel: "城市精英阶层", entryTier: "第4层", ceilingTier: null, breakthroughProbability: "较高", breakthroughPath: "创业成功或晋升大区总裁" },
      { cityLevel: "二线", education: "985/C9/清北", track: "体制内", startSalary: "8000-12000", age35Status: "副科/正科级，省级机关或市直部门核心岗位，发展空间大，是各省定向选调生的重点培养对象", housingStatus: "单位团购或人才公寓，低息贷款购房", classLevel: "政治新秀/地方精英预备役", entryTier: "第5层", ceilingTier: "第4层", breakthroughProbability: "高", breakthroughPath: "选调生通道，晋升速度快，有望成为厅级后备" },
      // ===== 三四线城市及县城 =====
      { cityLevel: "三四线", education: "二本/民办/大专", track: "体制外", startSalary: "3000-4500", age35Status: "月薪4-6k，生活节奏慢，但收入增长乏力，抗风险能力差", housingStatus: "父母留房或购买总价极低的楼梯房", classLevel: "县城边缘平民", entryTier: "第7层", ceilingTier: null, breakthroughProbability: "极低", breakthroughPath: "仅能维持生计" },
      { cityLevel: "三四线", education: "二本/民办/大专", track: "体制内", startSalary: "4000-6000", age35Status: "月薪7k-1w（含绩效），公积金高，实际购买力极强，是县城人上人", housingStatus: "单位福利房或全款买大面积新房，有车有库", classLevel: "县城'婆罗门'/上层平民", entryTier: "第6层", ceilingTier: null, breakthroughProbability: "中等（显性）", breakthroughPath: "掌握实质权力和人情网，后代起点超过一线第5层" },
      { cityLevel: "三四线", education: "普通一本/211", track: "体制内", startSalary: "5000-7000", age35Status: "35岁前大概率升至副科/实职股长或中级职称，成为当地有头有脸的人物", housingStatus: "多套无贷房产，甚至拥有宅基地", classLevel: "县城精英阶层", entryTier: "第5层", ceilingTier: "第4层", breakthroughProbability: "高", breakthroughPath: "在县域内属于顶尖存在" },
      { cityLevel: "三四线", education: "普通一本/211", track: "体制外", startSalary: "3500-5000", age35Status: "月薪5-8k，本地中小企业中层或自主创业，生活成本低但收入增长有限", housingStatus: "父母留房或低首付购房，无房贷压力", classLevel: "县城中产/小城创业者", entryTier: "第6层", ceilingTier: null, breakthroughProbability: "低至中等", breakthroughPath: "创业成功或成为本地行业头部，可升至第5层" },
      { cityLevel: "三四线", education: "985/C9/清北", track: "体制外", startSalary: "4000-6000", age35Status: "月薪6-10k，在本地属于高学历人才，但就业机会有限，多为自主创业或家族企业接班", housingStatus: "全款或低贷购买本地高端住宅，有车有房", classLevel: "小城精英/返乡创业人才", entryTier: "第6层", ceilingTier: null, breakthroughProbability: "低至中等", breakthroughPath: "利用一线经验和资源，在本地实现降维打击，成为行业头部" },
      { cityLevel: "三四线", education: "985/C9/清北", track: "体制内", startSalary: "6000-8000", age35Status: "副科/正科级或中级职称，享受人才引进政策补贴，在当地属于重点培养对象", housingStatus: "人才公寓或低价团购房，公积金覆盖房贷", classLevel: "人才引进型县城精英", entryTier: "第5层", ceilingTier: "第4层", breakthroughProbability: "中等偏高", breakthroughPath: "凭借985身份在基层快速提拔，未来有望进入市级或省级机关" }
    ],
    cityLevels: {
      first: ["北京", "上海", "广州", "深圳"],
      second: ["成都", "杭州", "武汉", "南京", "重庆", "天津", "苏州", "西安", "郑州", "长沙", "合肥", "青岛", "济南", "福州", "厦门", "宁波", "无锡", "东莞", "佛山"],
      third: ["其他城市及县城"]
    },
    educationMapping: {
      "二本/民办/大专": ["二本/民办本科", "高职/大专毕业"],
      "普通一本/211": ["普通一本", "211院校"],
      "985/C9/清北": ["普通985", "C9/顶尖985", "清北"]
    },
    trackDefinition: {
      "体制内": "公务员、事业单位、国企、教师、医生等有编制或体制内岗位",
      "体制外": "私企、外企、创业、自由职业等市场化岗位"
    }
  },

  // Sheet4: 专业收入加权系数
  majors: [
    { category: "计算机/AI类", examples: "人工智能、软件工程、数据科学、信息安全", factor: 1.70, desc: "薪资天花板，AI专业起薪最高" },
    { category: "金融/经济类", examples: "金融学、经济学", factor: 1.30, desc: "高薪但分化大，顶尖院校优势明显" },
    { category: "医学类（口腔/临床）", examples: "口腔医学、临床医学", factor: 1.20, desc: "前期投入大，职业稳定性强" },
    { category: "电子信息类", examples: "微电子、通信工程、光电信息", factor: 1.10, desc: "芯片、5G等国家战略产业" },
    { category: "自动化/电气类", examples: "电气工程、自动化、机器人工程", factor: 1.05, desc: "智能制造领域需求旺盛" },
    { category: "法学类", examples: "法学", factor: 1.00, desc: "需通过法考，呈\"先低后高\"特征" },
    { category: "文学/艺术类", examples: "新闻、设计、英语、汉语言", factor: 0.95, desc: "起薪偏低，头部效应明显" },
    { category: "理学类", examples: "数学、统计、物理", factor: 0.90, desc: "需深造，科研/数据方向" },
    { category: "管理类", examples: "工商管理、会计、信管", factor: 0.85, desc: "泛用性强但专业性弱" },
    { category: "教育学类", examples: "师范类、教育", factor: 0.75, desc: "各学科门类中薪资最低" },
    { category: "暂不确定", examples: "—", factor: 1.00, desc: "按该校平均水平计算" }
  ]
};

// 省份排序：北京/上海/天津靠前，其余按拼音排序
const PROVINCE_ORDER = [
  "北京", "上海", "天津",
  "安徽", "重庆", "福建", "甘肃", "广东", "广西", "贵州",
  "海南", "河北", "河南", "黑龙江", "湖北", "湖南", "吉林",
  "江苏", "江西", "辽宁", "内蒙古", "宁夏", "青海", "山东",
  "山西", "陕西", "四川", "西藏", "新疆", "云南", "浙江"
];
