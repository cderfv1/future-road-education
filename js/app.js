// ============================================
// 未来之路 · 教育路径模拟器 — 应用逻辑层
// ============================================

const app = {
  state: {
    currentPage: 'home',
    currentStep: 1,
    province: '',
    grade: '',
    gradeType: '',
    schoolLevel: '',
    rankTotal: '',
    rankPosition: '',
    rank: 50,
    selectedMajors: [],
    highSchoolLevel: '', // 初中生考上高中后选择的高中等级索引
    canEnterHighSchool: false, // 初中生是否能考上高中
    showHsLevelStep: false // 是否显示高中等级选择步骤
  },

  // 步骤序列定义
  // 基础步骤（高中生和初中生考不上）：1 → 2 → 3 → major
  // 初中生能考上：1 → 2 → 3 → hs-level → major
  getStepSequence() {
    const base = ['1', '2', '3'];
    if (this.state.gradeType === 'junior' && this.state.showHsLevelStep) {
      return [...base, 'hs-level', 'major'];
    }
    return [...base, 'major'];
  },

  getTotalSteps() {
    return this.getStepSequence().length;
  },

  init() {
    this.renderProvinces();
    this.renderGradeCards();
    this.renderSchoolCards();
    this.renderMajorGrid();
    this.renderHsLevelCards();
    this.bindRankInputs();
    this.bindProvinceSelect();
  },

  // 渲染省份下拉选择（北京/上海/天津靠前）
  renderProvinces() {
    const select = document.getElementById('province-select');
    const sortedProvinces = [...DATA.provinces].sort((a, b) => {
      const idxA = PROVINCE_ORDER.indexOf(a.name);
      const idxB = PROVINCE_ORDER.indexOf(b.name);
      return idxA - idxB;
    });
    sortedProvinces.forEach(p => {
      const option = document.createElement('option');
      option.value = p.name;
      option.textContent = p.name;
      select.appendChild(option);
    });
  },

  // 渲染年级卡片
  renderGradeCards() {
    const container = document.getElementById('grade-cards');
    DATA.grades.forEach((grade, index) => {
      const card = document.createElement('div');
      card.className = 'grade-card';
      card.dataset.grade = index;
      card.innerHTML = `
        <div class="grade-card-title">${grade.name}</div>
        <div class="grade-card-desc">${grade.desc}</div>
      `;
      card.addEventListener('click', () => this.selectGrade(index));
      container.appendChild(card);
    });
  },

  // 渲染学校等级卡片（根据年级类型动态渲染）
  renderSchoolCards() {
    const container = document.getElementById('school-cards');
    container.innerHTML = '';
    const levels = this.state.gradeType === 'junior' ? DATA.juniorSchoolLevels : DATA.schoolLevels;
    levels.forEach((level, index) => {
      const card = document.createElement('div');
      card.className = 'school-card';
      card.dataset.level = index;
      card.innerHTML = `
        <div class="school-card-title">${level.name}</div>
        <div class="school-card-factor">加成系数 ${level.minFactor} - ${level.maxFactor}</div>
        <div class="school-card-desc">${level.desc}</div>
      `;
      card.addEventListener('click', () => this.selectSchoolLevel(index));
      container.appendChild(card);
    });
  },

  // 渲染高中等级选择卡片（初中生考上高中后使用）
  renderHsLevelCards() {
    const container = document.getElementById('hs-level-cards');
    DATA.highSchoolTierMapping.forEach((tier, index) => {
      const card = document.createElement('div');
      card.className = 'school-card';
      card.dataset.hslevel = index;
      card.innerHTML = `
        <div class="school-card-title">${tier.name}</div>
        <div class="school-card-desc">${tier.desc}</div>
      `;
      card.addEventListener('click', () => this.selectHsLevel(index));
      container.appendChild(card);
    });
  },

  // 渲染专业九宫格
  renderMajorGrid() {
    const container = document.getElementById('major-grid');
    DATA.majors.forEach((major, index) => {
      const card = document.createElement('div');
      card.className = 'major-card';
      card.dataset.major = index;
      card.innerHTML = `
        <div class="major-card-title">${major.category}</div>
        <div class="major-card-examples">${major.examples}</div>
      `;
      card.addEventListener('click', () => this.toggleMajor(index));
      container.appendChild(card);
    });
  },

  // 绑定省份选择
  bindProvinceSelect() {
    const select = document.getElementById('province-select');
    select.addEventListener('change', (e) => {
      this.state.province = e.target.value;
      this.updateStep1Btn();
    });
  },

  // 更新步骤1的下一步按钮状态
  updateStep1Btn() {
    const btn = document.querySelector('.step-content[data-step="1"] .btn-next');
    btn.disabled = !(this.state.province && this.state.grade !== '');
  },

  // 绑定排名输入框
  bindRankInputs() {
    const totalInput = document.getElementById('rank-total');
    const positionInput = document.getElementById('rank-position');
    const resultEl = document.getElementById('rank-result');
    const percentEl = document.getElementById('rank-percent');
    const hintEl = document.getElementById('rank-hint');
    const nextBtn = document.getElementById('rank-next-btn');

    const hints = [
      { threshold: 5, text: '顶尖水平，清北有望！' },
      { threshold: 10, text: '非常优秀，985/211机会很大' },
      { threshold: 30, text: '成绩优良，一本很有希望' },
      { threshold: 50, text: '中等水平，有提升空间' },
      { threshold: 70, text: '中下游，需要加倍努力' },
      { threshold: 100, text: '基础薄弱，建议找准方向' }
    ];

    const updateRank = () => {
      const total = parseInt(totalInput.value);
      const position = parseInt(positionInput.value);

      if (total > 0 && position > 0) {
        const percent = Math.round((position / total) * 100);
        // 限制在1-100之间
        const clampedPercent = Math.max(1, Math.min(100, percent));
        this.state.rank = clampedPercent;
        this.state.rankTotal = total;
        this.state.rankPosition = position;

        resultEl.style.display = 'block';
        percentEl.textContent = clampedPercent + '%';
        const hint = hints.find(h => clampedPercent <= h.threshold);
        hintEl.textContent = hint ? hint.text : hints[hints.length - 1].text;
        nextBtn.disabled = false;
      } else {
        resultEl.style.display = 'none';
        percentEl.textContent = '—';
        hintEl.textContent = '请填写总人数和排名';
        nextBtn.disabled = true;
      }
    };

    totalInput.addEventListener('input', updateRank);
    positionInput.addEventListener('input', updateRank);
  },

  // 选择年级
  selectGrade(index) {
    this.state.grade = index;
    this.state.gradeType = DATA.grades[index].type;
    document.querySelectorAll('.grade-card').forEach((c, i) => {
      c.classList.toggle('selected', i === index);
    });
    // 重新渲染学校等级卡片（初中/高中不同）
    this.renderSchoolCards();
    this.state.schoolLevel = '';
    this.updateStep1Btn();
  },

  // 选择学校等级
  selectSchoolLevel(index) {
    this.state.schoolLevel = index;
    document.querySelectorAll('#school-cards .school-card').forEach((c, i) => {
      c.classList.toggle('selected', i === index);
    });
    const btn = document.querySelector('.step-content[data-step="2"] .btn-next');
    btn.disabled = false;
  },

  // 选择高中等级（初中生考上高中后）
  selectHsLevel(index) {
    this.state.highSchoolLevel = index;
    document.querySelectorAll('#hs-level-cards .school-card').forEach((c, i) => {
      c.classList.toggle('selected', i === index);
    });
    const btn = document.querySelector('.step-content[data-step="hs-level"] .btn-next');
    btn.disabled = false;
  },

  // 切换专业选择
  toggleMajor(index) {
    const major = DATA.majors[index];
    const card = document.querySelector(`.major-card[data-major="${index}"]`);

    if (major.category === '暂不确定') {
      this.state.selectedMajors = [index];
      document.querySelectorAll('.major-card').forEach((c, i) => {
        c.classList.toggle('selected', i === index);
      });
      return;
    }

    const unsureIndex = DATA.majors.findIndex(m => m.category === '暂不确定');
    const unsureCard = document.querySelector(`.major-card[data-major="${unsureIndex}"]`);
    if (unsureCard) unsureCard.classList.remove('selected');

    const pos = this.state.selectedMajors.indexOf(index);
    if (pos > -1) {
      this.state.selectedMajors.splice(pos, 1);
      card.classList.remove('selected');
    } else {
      this.state.selectedMajors.push(index);
      card.classList.add('selected');
    }

    const unsurePos = this.state.selectedMajors.indexOf(unsureIndex);
    if (unsurePos > -1) this.state.selectedMajors.splice(unsurePos, 1);
  },

  // 页面切换
  goToPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + page).classList.add('active');
    this.state.currentPage = page;
    window.scrollTo(0, 0);

    if (page === 'input') {
      this.resetInput();
    }
  },

  goBack() {
    const sequence = this.getStepSequence();
    const currentStepKey = this.getCurrentStepKey();
    const currentIdx = sequence.indexOf(currentStepKey);

    if (currentIdx > 0) {
      const prevStepKey = sequence[currentIdx - 1];
      this.goToStep(prevStepKey);
    } else {
      this.goToPage('home');
    }
  },

  // 获取当前步骤的key
  getCurrentStepKey() {
    const sequence = this.getStepSequence();
    return sequence[this.state.currentStep - 1] || sequence[0];
  },

  // 更新步骤指示器
  updateStepIndicator() {
    const indicator = document.getElementById('step-indicator');
    const totalSteps = this.getTotalSteps();
    const currentStep = this.state.currentStep;

    // 动态调整点的数量
    indicator.innerHTML = '';
    for (let i = 1; i <= totalSteps; i++) {
      const dot = document.createElement('span');
      dot.className = 'step-dot';
      if (i === currentStep) {
        dot.classList.add('active');
      }
      indicator.appendChild(dot);
    }
  },

  // 步骤切换
  goToStep(stepKey) {
    const sequence = this.getStepSequence();
    const stepIndex = sequence.indexOf(stepKey);
    if (stepIndex === -1) return;

    document.querySelectorAll('.step-content').forEach(s => s.classList.remove('active'));
    const targetStep = document.querySelector(`.step-content[data-step="${stepKey}"]`);
    if (targetStep) {
      targetStep.classList.add('active');
    }

    this.state.currentStep = stepIndex + 1;
    this.updateStepIndicator();

    // 根据年级类型更新学校等级步骤的文案
    if (stepKey === '2') {
      const gradeData = DATA.grades[this.state.grade];
      const titleEl = document.getElementById('school-step-title');
      const descEl = document.getElementById('school-step-desc');
      if (gradeData && gradeData.type === 'junior') {
        titleEl.textContent = '您所在初中的等级？';
        descEl.textContent = '初中等级影响高中升学竞争力，请如实选择。';
      } else {
        titleEl.textContent = '您所在高中的等级？';
        descEl.textContent = '高中等级直接影响高考升学竞争力，请如实选择。';
      }
    }

    window.scrollTo(0, 0);
  },

  nextStep() {
    const sequence = this.getStepSequence();
    const currentStepKey = sequence[this.state.currentStep - 1];

    // 如果当前是排名步骤（步骤3），且是初中生，需要判断能否考上高中
    if (currentStepKey === '3' && this.state.gradeType === 'junior') {
      const province = DATA.provinces.find(p => p.name === this.state.province);
      const schoolFactor = this.calcSchoolFactor();
      const highSchoolProb = province.highSchoolRate * schoolFactor;
      this.state.canEnterHighSchool = highSchoolProb >= 0.50;

      if (!this.state.canEnterHighSchool) {
        // 考不上高中，直接出结果
        this.finishInput();
        return;
      }

      // 能考上高中，显示高中等级选择步骤
      this.state.showHsLevelStep = true;
      this.updateStepIndicator();
      const updatedSequence = this.getStepSequence();
      const nextStepKey = updatedSequence[this.state.currentStep]; // hs-level
      this.goToStep(nextStepKey);
      return;
    }

    // 正常下一步
    if (this.state.currentStep < sequence.length) {
      const nextStepKey = sequence[this.state.currentStep];
      this.goToStep(nextStepKey);
    }
  },

  resetInput() {
    this.state.currentStep = 1;
    this.state.province = '';
    this.state.grade = '';
    this.state.gradeType = '';
    this.state.schoolLevel = '';
    this.state.rankTotal = '';
    this.state.rankPosition = '';
    this.state.rank = 50;
    this.state.selectedMajors = [];
    this.state.highSchoolLevel = '';
    this.state.canEnterHighSchool = false;
    this.state.showHsLevelStep = false;

    document.getElementById('province-select').value = '';
    document.querySelectorAll('.grade-card').forEach(c => c.classList.remove('selected'));
    document.querySelectorAll('#school-cards .school-card').forEach(c => c.classList.remove('selected'));
    document.querySelectorAll('#hs-level-cards .school-card').forEach(c => c.classList.remove('selected'));
    document.getElementById('rank-total').value = '';
    document.getElementById('rank-position').value = '';
    document.getElementById('rank-result').style.display = 'none';
    document.getElementById('rank-percent').textContent = '—';
    document.getElementById('rank-hint').textContent = '请填写总人数和排名';
    document.getElementById('rank-next-btn').disabled = true;
    document.querySelectorAll('.major-card').forEach(c => c.classList.remove('selected'));

    // 隐藏高中等级步骤
    document.querySelector('.step-content[data-step="hs-level"]').classList.remove('active');

    // 显示步骤1，隐藏其他
    document.querySelectorAll('.step-content').forEach(s => s.classList.remove('active'));
    document.querySelector('.step-content[data-step="1"]').classList.add('active');

    // 重置步骤指示器为4个点
    this.updateStepIndicator();

    // 重置按钮状态
    document.querySelector('.step-content[data-step="1"] .btn-next').disabled = true;
    document.querySelector('.step-content[data-step="2"] .btn-next').disabled = true;
    document.querySelector('.step-content[data-step="hs-level"] .btn-next').disabled = true;

    // 重新渲染学校等级卡片（默认高中版本，因为还没选年级）
    this.renderSchoolCards();
  },

  // 完成输入，计算结果
  finishInput() {
    const result = this.calculateResult();
    this.renderResult(result);
    this.goToPage('result');
  },

  // 计算学校系数
  calcSchoolFactor() {
    const levels = this.state.gradeType === 'junior' ? DATA.juniorSchoolLevels : DATA.schoolLevels;
    const schoolLevel = levels[this.state.schoolLevel];
    const rank = this.state.rank;
    if (rank <= 10) {
      return schoolLevel.maxFactor;
    } else if (rank <= 30) {
      return schoolLevel.minFactor + (schoolLevel.maxFactor - schoolLevel.minFactor) * 0.75;
    } else if (rank <= 50) {
      return (schoolLevel.minFactor + schoolLevel.maxFactor) / 2;
    } else {
      return schoolLevel.minFactor;
    }
  },

  // 核心算法逻辑
  calculateResult() {
    const province = DATA.provinces.find(p => p.name === this.state.province);
    const gradeData = DATA.grades[this.state.grade];
    const rank = this.state.rank;

    // 初中及以下：先判断能否考上普通高中
    if (gradeData.type === 'junior') {
      const juniorLevels = DATA.juniorSchoolLevels;
      const schoolFactor = this.calcSchoolFactor();
      const highSchoolProb = province.highSchoolRate * schoolFactor;

      if (!this.state.canEnterHighSchool) {
        // 无法上高中：展示中职/中专和初中毕业两条路径
        const path1 = DATA.pathMapping.find(p => p.path === '中职/中专毕业');
        const path2 = DATA.pathMapping.find(p => p.path === '初中毕业即就业');

        return {
          type: 'no_highschool',
          province: province.name,
          grade: gradeData.name,
          schoolLevelName: juniorLevels[this.state.schoolLevel].name,
          rank,
          highSchoolProb,
          altPaths: [
            { ...path1, classLevelNum: this.extractClassLevel(path1.classLevel) },
            { ...path2, classLevelNum: this.extractClassLevel(path2.classLevel) }
          ],
          primaryClassLevelNum: 7
        };
      }

      // 能考上高中：使用用户选择的高中等级
      const selectedHsTier = DATA.highSchoolTierMapping[this.state.highSchoolLevel];

      // 找到对应高中类型的学校等级索引
      let highSchoolLevelIndex = DATA.schoolLevels.findIndex(s =>
        selectedHsTier.name.includes(s.name.replace('/顶尖市重点', ''))
      );
      if (highSchoolLevelIndex === -1) highSchoolLevelIndex = 3; // 默认普通区重点

      // 使用高中的学校等级重新计算系数（保持当前排名）
      const hsLevel = DATA.schoolLevels[highSchoolLevelIndex];
      let hsFactor;
      if (rank <= 10) {
        hsFactor = hsLevel.maxFactor;
      } else if (rank <= 30) {
        hsFactor = hsLevel.minFactor + (hsLevel.maxFactor - hsLevel.minFactor) * 0.75;
      } else if (rank <= 50) {
        hsFactor = (hsLevel.minFactor + hsLevel.maxFactor) / 2;
      } else {
        hsFactor = hsLevel.minFactor;
      }

      // 大学档次预测（使用高中的系数）
      const uniResult = this.predictUniversity(province, hsFactor, rank);

      // 专业加权
      const majorInfo = this.calcMajorFactor(uniResult.tier);

      const pathData = DATA.pathMapping.find(p => p.path === uniResult.tierName) ||
                       DATA.pathMapping.find(p => p.path === '二本/民办本科');

      const finalSalary = Math.round(pathData.startSalary * majorInfo.majorFactor);

      return {
        type: 'junior_with_highschool',
        province: province.name,
        grade: gradeData.name,
        schoolLevelName: juniorLevels[this.state.schoolLevel].name,
        rank,
        highSchoolProb,
        predictedHighSchool: selectedHsTier,
        ...uniResult,
        startSalary: finalSalary,
        originalSalary: pathData.startSalary,
        classLevel: pathData.classLevel,
        classLevelNum: this.extractClassLevel(pathData.classLevel),
        career: pathData.career,
        ceiling: pathData.ceiling,
        ...majorInfo
      };
    }

    // 高中生：直接使用原有逻辑
    const schoolFactor = this.calcSchoolFactor();
    const uniResult = this.predictUniversity(province, schoolFactor, rank);
    const majorInfo = this.calcMajorFactor(uniResult.tier);

    const pathData = DATA.pathMapping.find(p => p.path === uniResult.tierName) ||
                     DATA.pathMapping.find(p => p.path === '二本/民办本科');

    const finalSalary = Math.round(pathData.startSalary * majorInfo.majorFactor);

    return {
      type: 'senior',
      province: province.name,
      grade: gradeData.name,
      schoolLevelName: DATA.schoolLevels[this.state.schoolLevel].name,
      rank,
      ...uniResult,
      startSalary: finalSalary,
      originalSalary: pathData.startSalary,
      classLevel: pathData.classLevel,
      classLevelNum: this.extractClassLevel(pathData.classLevel),
      career: pathData.career,
      ceiling: pathData.ceiling,
      ...majorInfo
    };
  },

  // 预测高中类型
  predictHighSchoolType(prob) {
    for (const mapping of DATA.highSchoolTierMapping) {
      if (prob >= mapping.threshold) {
        return mapping;
      }
    }
    return { name: '普通高中', desc: '普通高中，需更加努力' };
  },

  // 预测大学档次
  predictUniversity(province, schoolFactor, rank) {
    const adjusted985 = province.rate985 * schoolFactor;
    const adjusted211 = province.rate211 * schoolFactor;
    const adjustedFirstTier = province.firstTierRate * schoolFactor;
    const adjustedBachelor = province.bachelorRate * schoolFactor;
    const adjustedHighSchool = province.highSchoolRate * schoolFactor;

    let tier, tierName;
    if (adjusted985 >= 0.04) {
      tier = '985';
      tierName = rank <= 2 ? '清北' : (rank <= 5 ? 'C9/顶尖985' : '普通985');
    } else if (adjusted211 >= 0.10) {
      tier = '211';
      tierName = '211院校';
    } else if (adjustedFirstTier >= 0.25) {
      tier = 'firstTier';
      tierName = rank <= 20 ? '"双一流"院校' : '普通一本';
    } else if (adjustedBachelor >= 0.50) {
      tier = 'bachelor';
      tierName = '二本/民办本科';
    } else if (adjustedHighSchool >= 0.70) {
      tier = 'college';
      tierName = '高职/大专毕业';
    } else if (adjustedHighSchool >= 0.40) {
      tier = 'highSchool';
      tierName = '高中毕业即就业';
    } else {
      tier = 'middleSchool';
      tierName = '初中毕业即就业';
    }

    return { tier, tierName, adjustedRates: { rate985: adjusted985, rate211: adjusted211, firstTier: adjustedFirstTier, bachelor: adjustedBachelor } };
  },

  // 计算专业加权
  calcMajorFactor(tier) {
    let majorFactor = 1.0;
    let majorDesc = '按该校平均水平计算';
    let selectedMajorNames = [];

    if (this.state.selectedMajors.length > 0 && tier !== 'middleSchool' && tier !== 'highSchool') {
      const factors = this.state.selectedMajors.map(i => DATA.majors[i].factor);
      majorFactor = factors.reduce((a, b) => a + b, 0) / factors.length;
      selectedMajorNames = this.state.selectedMajors.map(i => DATA.majors[i].category);
      majorDesc = `已选专业：${selectedMajorNames.join('、')}，加权系数 ${majorFactor.toFixed(2)}`;
    }

    return { majorFactor, majorDesc, selectedMajorNames };
  },

  // 提取阶层数字
  extractClassLevel(classLevelStr) {
    const match = classLevelStr.match(/第(\d)层/);
    return match ? parseInt(match[1]) : 5;
  },

  // 渲染结果页
  renderResult(result) {
    const titleEl = document.getElementById('result-main-title');
    const highSchoolInfo = document.getElementById('highschool-info');
    const resultCards = document.getElementById('result-cards-container');
    const altPaths = document.getElementById('alt-paths');
    const tierLabel = document.getElementById('result-tier-label');
    const tierCard = document.getElementById('result-card-tier');

    // 重置显示状态
    highSchoolInfo.style.display = 'none';
    altPaths.style.display = 'none';
    resultCards.style.display = 'flex';
    tierCard.style.display = 'block';

    if (result.type === 'no_highschool') {
      // 未上高中路径
      titleEl.textContent = `${result.province} ${result.schoolLevelName} 孩子的未来路径预测`;

      highSchoolInfo.style.display = 'block';
      highSchoolInfo.innerHTML = `
        <div class="highschool-warning">
          <div class="warning-icon">⚠</div>
          <div class="warning-text">
            <strong>根据当前成绩和所在地区，可能无法升入普通高中。</strong>
            <br>预测普高录取概率：${(result.highSchoolProb * 100).toFixed(1)}%
          </div>
        </div>
      `;

      tierCard.style.display = 'none';
      document.getElementById('result-salary').textContent = '—';
      document.getElementById('result-class').textContent = '—';
      document.getElementById('career-text').textContent = '请查看下方备选路径，了解不同发展方向。';
      document.getElementById('ceiling-text').textContent = '—';

      // 备选路径
      altPaths.style.display = 'block';
      result.altPaths.forEach((path, i) => {
        const el = document.getElementById(`alt-path-${i + 1}`);
        el.innerHTML = `
          <div class="alt-path-header">
            <span class="alt-path-name">${path.path}</span>
            <span class="alt-path-salary">起薪 ¥${path.startSalary.toLocaleString()}/月</span>
          </div>
          <div class="alt-path-class">${path.classLevel}</div>
          <div class="alt-path-career">${path.career}</div>
          <div class="alt-path-ceiling">${path.ceiling}</div>
        `;
      });

      document.getElementById('major-bonus-section').style.display = 'none';

    } else if (result.type === 'junior_with_highschool') {
      // 初中上高中路径
      titleEl.textContent = `${result.province} ${result.schoolLevelName} 孩子的未来路径预测`;

      highSchoolInfo.style.display = 'block';
      highSchoolInfo.innerHTML = `
        <div class="highschool-success">
          <div class="success-icon">✓</div>
          <div class="success-text">
            <strong>预计考入高中类型：${result.predictedHighSchool.name}</strong>
            <br>预测普高录取概率：${(result.highSchoolProb * 100).toFixed(1)}% · ${result.predictedHighSchool.desc}
          </div>
        </div>
      `;

      tierLabel.textContent = '预测大学档次';
      document.getElementById('result-tier').textContent = result.tierName;
      document.getElementById('result-salary').textContent = `¥${result.startSalary.toLocaleString()}`;
      document.getElementById('result-class').textContent = result.classLevel;
      document.getElementById('career-text').textContent = result.career;
      document.getElementById('ceiling-text').textContent = result.ceiling;

      const majorSection = document.getElementById('major-bonus-section');
      if (result.selectedMajorNames.length > 0) {
        majorSection.style.display = 'block';
        document.getElementById('major-bonus-text').textContent = result.majorDesc;
      } else {
        majorSection.style.display = 'none';
      }

    } else {
      // 高中生原有路径
      titleEl.textContent = '您的教育路径预测';

      tierLabel.textContent = '预测大学档次';
      document.getElementById('result-tier').textContent = result.tierName;
      document.getElementById('result-salary').textContent = `¥${result.startSalary.toLocaleString()}`;
      document.getElementById('result-class').textContent = result.classLevel;
      document.getElementById('career-text').textContent = result.career;
      document.getElementById('ceiling-text').textContent = result.ceiling;

      const majorSection = document.getElementById('major-bonus-section');
      if (result.selectedMajorNames.length > 0) {
        majorSection.style.display = 'block';
        document.getElementById('major-bonus-text').textContent = result.majorDesc;
      } else {
        majorSection.style.display = 'none';
      }
    }
  },

  // 换个假设
  changeAssumption() {
    this.goToPage('input');
  },

  // 分享
  share() {
    const text = `我在「未来之路·教育路径模拟器」测试了我的教育路径预测，快来试试吧！`;
    if (navigator.share) {
      navigator.share({ title: '未来之路·教育路径模拟器', text });
    } else {
      alert('已复制分享文案：' + text);
    }
  },

  // 免责声明
  showDisclaimer() {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-disclaimer').classList.add('active');
    this.state.prevPage = this.state.currentPage;
    this.state.currentPage = 'disclaimer';
  },

  closeDisclaimer() {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = this.state.prevPage || 'home';
    document.getElementById('page-' + target).classList.add('active');
    this.state.currentPage = target;
    this.state.prevPage = null;
  }
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
