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

  // 年级选项
  grades: [
    { name: "小学", type: "junior", desc: "小学阶段，关注初中升学" },
    { name: "初一", type: "junior", desc: "初中起始阶段" },
    { name: "初二", type: "junior", desc: "初中关键期" },
    { name: "初三", type: "junior", desc: "即将面临中考" },
    { name: "高一", type: "senior", desc: "高中起始阶段" },
    { name: "高二", type: "senior", desc: "高中关键期" },
    { name: "高三", type: "senior", desc: "即将面临高考" }
  ],

  // Sheet2: 学校等级加成系数（高中阶段使用）
  schoolLevels: [
    { name: "省级示范/顶尖市重点", minFactor: 1.6, maxFactor: 2.2, desc: "垄断985/211名额，一本率90%+" },
    { name: "普通市重点", minFactor: 1.3, maxFactor: 1.6, desc: "一本率60%-85%" },
    { name: "优质区重点", minFactor: 1.1, maxFactor: 1.3, desc: "一本率40%-65%" },
    { name: "普通区重点", minFactor: 0.9, maxFactor: 1.1, desc: "一本率20%-40%" },
    { name: "普通高中", minFactor: 0.5, maxFactor: 0.8, desc: "一本率不足20%" }
  ],

  // 初中学校等级加成系数（初中阶段使用，最后一项改为"普通初中"）
  juniorSchoolLevels: [
    { name: "省级示范/顶尖市重点", minFactor: 1.6, maxFactor: 2.2, desc: "垄断优质高中名额，升学率90%+" },
    { name: "普通市重点", minFactor: 1.3, maxFactor: 1.6, desc: "升学率60%-85%" },
    { name: "优质区重点", minFactor: 1.1, maxFactor: 1.3, desc: "升学率40%-65%" },
    { name: "普通区重点", minFactor: 0.9, maxFactor: 1.1, desc: "升学率20%-40%" },
    { name: "普通初中", minFactor: 0.5, maxFactor: 0.8, desc: "升学率不足20%" }
  ],

  // 高中类型映射（概率 → 高中等级，用于初中生考上高中后的选择）
  highSchoolTierMapping: [
    { threshold: 0.80, name: "省级示范/顶尖市重点", desc: "优质高中，升学率领先" },
    { threshold: 0.60, name: "普通市重点", desc: "市重点高中，教学质量优良" },
    { threshold: 0.40, name: "区重点", desc: "区重点高中，有一定竞争力" },
    { threshold: 0.20, name: "普通高中", desc: "普通高中，需更加努力" }
  ],

  // Sheet3: 教育路径 → 社会阶层与未来发展
  pathMapping: [
    { path: "未完成义务教育", startSalary: 2500, classLevel: "第9层（底层）", career: "零散工、务农、低保户，收入极低且不稳定，缺乏社会保障", ceiling: "第8-9层 — 极少数通过技能培训或创业升至第8层，多数长期处于底层，年收入3-5万" },
    { path: "初中毕业即就业", startSalary: 3000, classLevel: "第8层（底层边缘）", career: "服务员、快递员、工厂普工、建筑小工，工作强度大，收入低，晋升空间极小", ceiling: "第7-8层 — 少数通过技能积累或小本创业升至第7层（如小个体户、包工头），多数维持底层收入，年收入4-8万" },
    { path: "高中毕业即就业", startSalary: 3500, classLevel: "第7层（下层）", career: "销售、客服、司机、小型维修工，收入略高于初中毕业生，但缺乏专业技能", ceiling: "第6-7层 — 部分通过技能提升和经验积累升至销售主管、技术工人等，年收入6-15万" },
    { path: "中职/中专毕业", startSalary: 4000, classLevel: "第7层（下层）", career: "初级技工、幼师、护士助理、文员，具备基础职业技能，就业相对稳定", ceiling: "第6-7层 — 技术熟练者可升至高级技工或基层管理，年收入6-18万" },
    { path: "技校毕业", startSalary: 4500, classLevel: "第6层（中下阶层）", career: "技术工人、电工、焊工、厨师，拥有一技之长，收入中等偏下", ceiling: "第6层 — 高级技师或技术管理岗，年收入10-25万，顶尖者超50万" },
    { path: "高职/大专毕业", startSalary: 5000, classLevel: "第6层（中下阶层）", career: "技术员、初级工程师、行政专员、销售代表，具备一定专业基础", ceiling: "第5-6层 — 技术骨干或中层管理，年收入10-20万" },
    { path: "二本/民办本科", startSalary: 5500, classLevel: "第6层（中下阶层）", career: "普通白领、初级工程师、中小学教师、基层公务员，学历门槛达标，竞争激烈", ceiling: "第6-7层 — 少数进入管理岗，多数维持工薪阶层，年收入6-15万" },
    { path: "普通一本", startSalary: 7000, classLevel: "第5层（中层）", career: "工程师、教师、医生、中层公务员，具备较强专业能力和学历优势", ceiling: "第5-6层 — 少数晋升中层管理，多数稳定在技术或行政岗位，年收入10-25万" },
    { path: "\"双一流\"院校", startSalary: 9000, classLevel: "第5层（中层）", career: "优质企业核心岗位、重点中学教师、三甲医院医生、科研院所", ceiling: "第5层 — 年收入15-35万" },
    { path: "211院校", startSalary: 10000, classLevel: "第5层（中层）", career: "名企管培生、金融机构、互联网大厂、科研机构，具备较强竞争力", ceiling: "第5层（中层） — 多数稳定在中层岗位，年收入15-40万" },
    { path: "普通985", startSalary: 12000, classLevel: "第4-5层（中上层）", career: "头部企业核心岗、高校教职、科研院所、公务员选调生，学历优势明显", ceiling: "第4-5层 — 部分晋升管理岗，年收入20-60万" },
    { path: "C9/顶尖985", startSalary: 15000, classLevel: "第4层（中上层/精英中产）", career: "顶尖企业、投行、咨询、头部互联网、科研机构核心岗位", ceiling: "第4层（中上层/精英中产） — 多数成长为部门负责人、技术专家，年收入30-80万" },
    { path: "清北", startSalary: 20000, classLevel: "第3-4层（上层中产/新贵阶层）", career: "顶级投行、咨询公司、互联网高管、科研院所领军人才、创业", ceiling: "第3-4层（上层中产/新贵阶层） — 部分进入高管层、创业成功或成为行业专家，年收入50-200万" }
  ],

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
  ],

  // 阶层金字塔颜色（从下到上：第9层→第1层）
  pyramidColors: [
    "#1E293B", "#334155", "#475569", "#64748B", "#94A3B8",
    "#CBD5E1", "#FCD34D", "#F59E0B", "#D97706"
  ],

  // 阶层标签
  classLabels: [
    "第1层：顶层精英", "第2层：上层富豪", "第3层：上层中产/新贵",
    "第4层：中上层/精英中产", "第5层：中层", "第6层：中下阶层",
    "第7层：下层", "第8层：底层边缘", "第9层：底层"
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
