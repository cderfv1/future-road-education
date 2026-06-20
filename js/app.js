// ============================================
// 未来之路 · 教育路径模拟器 — 应用逻辑层
// 5步流程：省份+学段 → 学校等级+排名 → 预测 → 选专业+赛道 → 结果
// 核心算法：排名区间映射表 + 线性插值 + 区间判定
// ============================================

const app = {
  state: {
    currentPage: 'home',
    currentStep: 1,
    totalSteps: 5,
    province: '',
    stage: '',          // 'junior' or 'senior'
    schoolLevel: -1,    // 选中的学校等级索引
    rankTotal: '',
    rankPosition: '',
    rankPercent: 0,
    // 初中预测结果（区间）
    juniorRankLow: 0,
    juniorRankHigh: 0,
    canEnterHighSchool: '',  // 'likely' | 'unlikely' | 'borderline'
    predictedHighSchoolLow: '',
    predictedHighSchoolHigh: '',
    selectedHighSchool: '',
    highSchoolRankPercent: 0,
    // 高中/大学预测结果（区间）
    seniorRankLow: 0,
    seniorRankHigh: 0,
    universityTierLow: '',
    universityTierHigh: '',
    universityPathNameLow: '',
    universityPathNameHigh: '',
    // 城市能级与赛道
    cityLevel: '',      // '一线' | '二线' | '三四线'
    track: '体制外',    // '体制内' | '体制外'
    // 专业
    selectedMajors: []
  },

  // ============================================
  // 核心算法函数
  // ============================================

  /**
   * 查询映射表 + 线性插值
   */
  queryRankMapping(schoolName, rankPercent, stage) {
    const mapping = stage === 'junior' ? DATA.juniorRankMapping : DATA.seniorRankMapping;
    const table = mapping[schoolName];
    if (!table || table.length === 0) return { low: rankPercent, high: rankPercent };

    const exact = table.find(r => r.rank === rankPercent);
    if (exact) return { low: exact.low, high: exact.high };

    if (rankPercent < table[0].rank) {
      return this._extrapolate(table[0], table[1], rankPercent);
    }
    if (rankPercent > table[table.length - 1].rank) {
      const n = table.length;
      return this._extrapolate(table[n - 2], table[n - 1], rankPercent);
    }

    for (let i = 0; i < table.length - 1; i++) {
      if (rankPercent > table[i].rank && rankPercent < table[i + 1].rank) {
        return this._interpolate(table[i], table[i + 1], rankPercent);
      }
    }

    return { low: rankPercent, high: rankPercent };
  },

  _interpolate(pointA, pointB, x) {
    const ratio = (x - pointA.rank) / (pointB.rank - pointA.rank);
    return {
      low: pointA.low + ratio * (pointB.low - pointA.low),
      high: pointA.high + ratio * (pointB.high - pointA.high)
    };
  },

  _extrapolate(pointA, pointB, x) {
    const ratio = (x - pointA.rank) / (pointB.rank - pointA.rank);
    return {
      low: pointA.low + ratio * (pointB.low - pointA.low),
      high: pointA.high + ratio * (pointB.high - pointA.high)
    };
  },

  /**
   * 区间判定
   */
  judgeRange(low, high, threshold) {
    if (high < threshold) return 'likely';
    if (low > threshold) return 'unlikely';
    return 'borderline';
  },

  /**
   * 根据省排名区间判定大学档次（返回区间）
   */
  calcUniversityTierRange(rankLow, rankHigh, province) {
    const tiers = [
      { threshold: province.rate985 * 100,       name: '985院校', pathName: '普通985' },
      { threshold: province.rate211 * 100,       name: '211院校', pathName: '211院校' },
      { threshold: province.firstTierRate * 100, name: '一本院校', pathName: '普通一本' },
      { threshold: province.bachelorRate * 100, name: '本科院校', pathName: '二本/民办本科' },
      { threshold: province.highSchoolRate * 100, name: '大专',     pathName: '高职/大专毕业' },
      { threshold: Infinity,                      name: '未上大学', pathName: '高中毕业即就业' }
    ];

    let tierLow = tiers[tiers.length - 1];
    for (let i = 0; i < tiers.length; i++) {
      if (rankLow < tiers[i].threshold) { tierLow = tiers[i]; break; }
    }

    let tierHigh = tiers[tiers.length - 1];
    for (let i = 0; i < tiers.length; i++) {
      if (rankHigh < tiers[i].threshold) { tierHigh = tiers[i]; break; }
    }

    return {
      tierLow: tierLow.name,
      tierHigh: tierHigh.name,
      pathLow: tierLow.pathName,
      pathHigh: tierHigh.pathName
    };
  },

  /**
   * 根据省排名区间推测高中等级
   */
  calcHighSchoolTierRange(rankLow, rankHigh, highSchoolRatePercent) {
    const tiers = [
      { maxRatio: 0.10, name: '省级示范/顶尖市重点' },
      { maxRatio: 0.30, name: '普通市重点' },
      { maxRatio: 0.60, name: '区重点' },
      { maxRatio: 1.00, name: '普通高中' }
    ];

    const relLow = rankLow / highSchoolRatePercent;
    const relHigh = rankHigh / highSchoolRatePercent;

    let hsLow = tiers[tiers.length - 1].name;
    for (let i = 0; i < tiers.length; i++) {
      if (relLow <= tiers[i].maxRatio) { hsLow = tiers[i].name; break; }
    }

    let hsHigh = tiers[tiers.length - 1].name;
    for (let i = 0; i < tiers.length; i++) {
      if (relHigh <= tiers[i].maxRatio) { hsHigh = tiers[i].name; break; }
    }

    return { hsLow, hsHigh };
  },

  /**
   * 根据省份推导城市能级
   */
  getCityLevel(provinceName) {
    const sd = DATA.societyData;
    if (sd.cityLevels.first.includes(provinceName)) return '一线';
    if (sd.cityLevels.second.includes(provinceName)) return '二线';
    return '三四线';
  },

  /**
   * 将大学档次（pathName）映射到 societyData 的 education 键
   */
  getEducationKey(pathName) {
    const mapping = DATA.societyData.educationMapping;
    for (const [key, values] of Object.entries(mapping)) {
      if (values.includes(pathName)) return key;
    }
    // 未上大学的情况，返回最低档作为兜底
    if (pathName === '高中毕业即就业' || pathName === '初中毕业即就业') {
      return '二本/民办/大专';
    }
    return '二本/民办/大专';
  },

  /**
   * 查询社会阶层矩阵
   * @param {string} cityLevel - '一线'|'二线'|'三四线'
   * @param {string} educationKey - '二本/民办/大专'|'普通一本/211'|'985/C9/清北'
   * @param {string} track - '体制内'|'体制外'
   * @returns {object|null}
   */
  querySocietyMatrix(cityLevel, educationKey, track) {
    const matrix = DATA.societyData.matrix;
    return matrix.find(m =>
      m.cityLevel === cityLevel &&
      m.education === educationKey &&
      m.track === track
    ) || null;
  },

  /**
   * 格式化档次区间为可读字符串
   */
  formatTierRange(tierLow, tierHigh) {
    if (tierLow === tierHigh) return tierLow;
    if (tierLow === '未上大学') return tierHigh + '或无法上大学';
    if (tierHigh === '未上大学') return tierLow + '或无法上大学';
    return tierLow + '到' + tierHigh + '之间';
  },

  // ============================================
  // 初始化
  // ============================================
  init() {
    this.renderProvinces();
    this.renderMajorGrid();
    this.bindProvinceSelect();
    this.bindRankInputs();
  },

  // ============================================
  // 第1步：省份 + 学段
  // ============================================
  renderProvinces() {
    const select = document.getElementById('province-select');
    if (!select) return;
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

  selectStage(stage) {
    this.state.stage = stage;
    document.querySelectorAll('.stage-card').forEach(c => {
      c.classList.toggle('selected', c.dataset.stage === stage);
    });
    this.updateStep1Btn();
  },

  bindProvinceSelect() {
    const select = document.getElementById('province-select');
    if (!select) return;
    select.addEventListener('change', (e) => {
      this.state.province = e.target.value;
      if (this.state.province) {
        this.state.cityLevel = this.getCityLevel(this.state.province);
      }
      this.updateStep1Btn();
    });
  },

  updateStep1Btn() {
    const btn = document.querySelector('.step-content[data-step="1"] .btn-next');
    if (btn) {
      btn.disabled = !(this.state.province && this.state.stage !== '');
    }
  },

  // ============================================
  // 第2步：学校等级 + 年级排名
  // ============================================
  renderSchoolCards() {
    const container = document.getElementById('school-cards');
    if (!container) return;
    container.innerHTML = '';
    const levels = this.state.stage === 'junior'
      ? DATA.juniorSchoolLevels
      : DATA.seniorSchoolLevels;
    if (!levels) return;
    levels.forEach((level, index) => {
      const card = document.createElement('div');
      card.className = 'school-card';
      card.dataset.level = index;
      card.innerHTML = `
        <div class="school-card-title">${level.name}</div>
        <div class="school-card-desc">${level.desc}</div>
      `;
      card.addEventListener('click', () => this.selectSchoolLevel(index));
      container.appendChild(card);
    });
  },

  selectSchoolLevel(index) {
    this.state.schoolLevel = index;
    document.querySelectorAll('#school-cards .school-card').forEach((c, i) => {
      c.classList.toggle('selected', i === index);
    });
    this.updateStep2Btn();
  },

  bindRankInputs() {
    const totalInput = document.getElementById('rank-total');
    const positionInput = document.getElementById('rank-position');
    if (!totalInput || !positionInput) return;

    const resultEl = document.getElementById('rank-result');
    const percentEl = document.getElementById('rank-percent');
    const hintEl = document.getElementById('rank-hint');

    const hints = [
      { threshold: 5, text: '顶尖水平，竞争力极强！' },
      { threshold: 10, text: '非常优秀，有望冲击优质学校' },
      { threshold: 30, text: '成绩优良，有较大提升空间' },
      { threshold: 50, text: '中等水平，需要持续努力' },
      { threshold: 70, text: '中下游，需要加倍努力' },
      { threshold: 100, text: '基础薄弱，找准方向奋起直追' }
    ];

    const updateRank = () => {
      const total = parseInt(totalInput.value);
      const position = parseInt(positionInput.value);

      if (total > 0 && position > 0 && position <= total) {
        const percent = Math.round((position / total) * 100);
        const clampedPercent = Math.max(1, Math.min(100, percent));
        this.state.rankTotal = total;
        this.state.rankPosition = position;
        this.state.rankPercent = clampedPercent;

        if (resultEl) resultEl.style.display = 'block';
        if (percentEl) percentEl.textContent = clampedPercent + '%';
        const hint = hints.find(h => clampedPercent <= h.threshold);
        if (hintEl) hintEl.textContent = hint ? hint.text : hints[hints.length - 1].text;
        this.updateStep2Btn();
      } else {
        if (resultEl) resultEl.style.display = 'none';
        if (percentEl) percentEl.textContent = '\u2014';
        if (hintEl) hintEl.textContent = '请填写总人数和排名';
        this.state.rankPercent = 0;
        this.updateStep2Btn();
      }
    };

    totalInput.addEventListener('input', updateRank);
    positionInput.addEventListener('input', updateRank);
  },

  updateStep2Btn() {
    const btn = document.querySelector('.step-content[data-step="2"] .btn-next');
    if (btn) {
      btn.disabled = !(this.state.schoolLevel >= 0 && this.state.rankPercent > 0);
    }
  },

  // ============================================
  // 步骤导航
  // ============================================
  nextStep() {
    const step = this.state.currentStep;

    if (step === 1) {
      this.renderSchoolCards();
      this.goToStep('2');
    } else if (step === 2) {
      if (this.state.stage === 'junior') {
        this.calcJuniorPrediction();
        this.renderJuniorPrediction();
        this.goToStep('3-junior');
      } else {
        this.calcSeniorPrediction();
        this.renderSeniorPrediction();
        this.goToStep('3-senior');
      }
    } else if (step === 3) {
      this.goToStep('4');
    } else if (step === 4) {
      this.renderResult();
      this.goToPage('result');
    }
  },

  finishInput() {
    this.renderResult();
    this.goToPage('result');
  },

  goBack() {
    const step = this.state.currentStep;
    if (step === 3) {
      this.goToStep('2');
      this.state.currentStep = 2;
      this.updateStepProgress();
    } else if (step > 1) {
      this.goToStep(String(step - 1));
    } else {
      this.goToPage('home');
    }
  },

  goToStep(stepKey) {
    document.querySelectorAll('.step-content').forEach(s => s.classList.remove('active'));
    const target = document.querySelector(`.step-content[data-step="${stepKey}"]`);
    if (target) target.classList.add('active');

    if (stepKey === '1') this.state.currentStep = 1;
    else if (stepKey === '2') this.state.currentStep = 2;
    else if (stepKey === '3-junior' || stepKey === '3-senior') this.state.currentStep = 3;
    else if (stepKey === '4') this.state.currentStep = 4;

    this.updateStepProgress();
    window.scrollTo(0, 0);
  },

  goToPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById('page-' + page);
    if (target) target.classList.add('active');
    this.state.currentPage = page;
    window.scrollTo(0, 0);

    if (page === 'input') {
      this.resetInput();
    }
  },

  updateStepProgress() {
    const progressEl = document.getElementById('step-progress');
    if (progressEl) {
      progressEl.textContent = this.state.currentStep + ' / ' + this.state.totalSteps;
    }
  },

  // ============================================
  // 赛道选择
  // ============================================
  selectTrack(track) {
    this.state.track = track;
    document.querySelectorAll('.track-card').forEach(c => {
      c.classList.toggle('selected', c.dataset.track === track);
    });
  },

  // ============================================
  // 第3步 - 初中分支：中考预测
  // ============================================
  calcJuniorPrediction() {
    const province = DATA.provinces.find(p => p.name === this.state.province);
    const schoolName = DATA.juniorSchoolLevels[this.state.schoolLevel].name;
    const highSchoolRatePercent = province.highSchoolRate * 100;

    const rankRange = this.queryRankMapping(schoolName, this.state.rankPercent, 'junior');
    this.state.juniorRankLow = rankRange.low;
    this.state.juniorRankHigh = rankRange.high;

    this.state.canEnterHighSchool = this.judgeRange(rankRange.low, rankRange.high, highSchoolRatePercent);

    if (this.state.canEnterHighSchool !== 'unlikely') {
      const hsRange = this.calcHighSchoolTierRange(rankRange.low, rankRange.high, highSchoolRatePercent);
      this.state.predictedHighSchoolLow = hsRange.hsLow;
      this.state.predictedHighSchoolHigh = hsRange.hsHigh;
      this.state.selectedHighSchool = hsRange.hsLow;
    }
  },

  renderJuniorPrediction() {
    const container = document.getElementById('junior-prediction-content');
    if (!container) return;

    const province = DATA.provinces.find(p => p.name === this.state.province);
    const highSchoolRatePercent = (province.highSchoolRate * 100).toFixed(1);
    const rankLowStr = this.state.juniorRankLow.toFixed(1);
    const rankHighStr = this.state.juniorRankHigh.toFixed(1);

    let html = '';

    const isLikely = this.state.canEnterHighSchool === 'likely';
    const isBorderline = this.state.canEnterHighSchool === 'borderline';
    const blockClass = isLikely ? 'success' : (isBorderline ? 'info' : 'warning');

    let conclusionText = '';
    if (isLikely) conclusionText = '您大概率能顺利考上普通高中';
    else if (isBorderline) conclusionText = '处于临界区间，有一定不确定性';
    else conclusionText = '您可能无法考上普通高中，建议关注中职/技校路径';

    html += `
      <div class="prediction-block ${blockClass}">
        <div class="prediction-label">预测省排名区间</div>
        <div class="prediction-value">前${rankLowStr}% - ${rankHighStr}%之间</div>
        <div class="prediction-detail">该省高中升学率 ${highSchoolRatePercent}%</div>
        <div class="prediction-detail" style="margin-top:8px; font-weight:600; color:${isLikely ? '#065F46' : (isBorderline ? '#1E40AF' : '#92400E')};">${conclusionText}</div>
      </div>
    `;

    if (this.state.canEnterHighSchool !== 'unlikely') {
      const hsText = this.formatTierRange(this.state.predictedHighSchoolLow, this.state.predictedHighSchoolHigh);
      html += `
        <div class="prediction-block info">
          <div class="prediction-label">推测能上的高中等级</div>
          <div class="prediction-value">${hsText}</div>
          <div class="prediction-detail">相对位置区间：${(this.state.juniorRankLow / parseFloat(highSchoolRatePercent) * 100).toFixed(0)}% - ${(this.state.juniorRankHigh / parseFloat(highSchoolRatePercent) * 100).toFixed(0)}%</div>
        </div>
      `;

      html += `
        <div class="prediction-block">
          <div class="prediction-label">以上为系统推测结果，您可以根据实际情况手动调整</div>
          <div class="prediction-select-wrapper">
            <select id="hs-level-select" class="prediction-select" onchange="app.onHighSchoolSelect(this.value)">
      `;
      DATA.seniorSchoolLevels.forEach(level => {
        const selected = level.name === this.state.selectedHighSchool ? ' selected' : '';
        html += `<option value="${level.name}"${selected}>${level.name}</option>`;
      });
      html += `
            </select>
          </div>
          <div class="prediction-rank-input">
            <label>预计高中阶段年级排名百分比（1-100）</label>
            <input type="number" id="hs-rank-percent" placeholder="例如 20" min="1" max="100" value="${this.state.highSchoolRankPercent || ''}" oninput="app.onHighSchoolRankInput(this.value)">
            <div class="prediction-hint">请输入您预计在高中阶段的排名百分比。例如：年级500人排第50名，即10%。</div>
          </div>
        </div>
      `;
    } else {
      html += `
        <div class="prediction-block">
          <div class="prediction-hint">以上仅为参考，实际录取受多种因素影响。您仍可选择继续模拟后续路径。</div>
        </div>
      `;
    }

    container.innerHTML = html;
    this.updateJuniorNextBtn();
  },

  onHighSchoolSelect(value) {
    this.state.selectedHighSchool = value;
    this.updateJuniorNextBtn();
  },

  onHighSchoolRankInput(value) {
    const num = parseInt(value);
    if (num >= 1 && num <= 100) {
      this.state.highSchoolRankPercent = num;
    } else {
      this.state.highSchoolRankPercent = 0;
    }
    this.updateJuniorNextBtn();
  },

  updateJuniorNextBtn() {
    const btn = document.getElementById('junior-next-btn');
    if (btn) {
      if (this.state.canEnterHighSchool !== 'unlikely') {
        btn.disabled = !(this.state.selectedHighSchool && this.state.highSchoolRankPercent > 0);
      } else {
        btn.disabled = false;
      }
    }
  },

  // ============================================
  // 第3步 - 高中分支：高考预测
  // ============================================
  calcSeniorPrediction() {
    const province = DATA.provinces.find(p => p.name === this.state.province);
    const schoolName = DATA.seniorSchoolLevels[this.state.schoolLevel].name;

    const rankRange = this.queryRankMapping(schoolName, this.state.rankPercent, 'senior');
    this.state.seniorRankLow = rankRange.low;
    this.state.seniorRankHigh = rankRange.high;

    const tierRange = this.calcUniversityTierRange(rankRange.low, rankRange.high, province);
    this.state.universityTierLow = tierRange.tierLow;
    this.state.universityTierHigh = tierRange.tierHigh;
    this.state.universityPathNameLow = tierRange.pathLow;
    this.state.universityPathNameHigh = tierRange.pathHigh;
  },

  renderSeniorPrediction() {
    const container = document.getElementById('senior-prediction-content');
    if (!container) return;

    const province = DATA.provinces.find(p => p.name === this.state.province);
    const rankLowStr = this.state.seniorRankLow.toFixed(1);
    const rankHighStr = this.state.seniorRankHigh.toFixed(1);
    const schoolName = DATA.seniorSchoolLevels[this.state.schoolLevel].name;

    let html = '';

    html += `
      <div class="prediction-block info">
        <div class="prediction-label">查询映射表结果</div>
        <div class="prediction-detail">
          学校等级：${schoolName}<br>
          校内排名百分比：${this.state.rankPercent}%<br>
          预测省排名区间：<strong>前${rankLowStr}% - ${rankHighStr}%之间</strong>
        </div>
      </div>
    `;

    html += `<div class="prediction-block"><div class="prediction-label">该省各档次录取率参考</div>`;
    html += `<div class="prediction-detail">`;
    html += `985：${(province.rate985 * 100).toFixed(1)}% | `;
    html += `211：${(province.rate211 * 100).toFixed(1)}% | `;
    html += `一本：${(province.firstTierRate * 100).toFixed(1)}%<br>`;
    html += `本科：${(province.bachelorRate * 100).toFixed(1)}% | `;
    html += `大专：${(province.highSchoolRate * 100).toFixed(1)}%`;
    html += `</div></div>`;

    const tierText = this.formatTierRange(this.state.universityTierLow, this.state.universityTierHigh);
    const isFailure = this.state.universityTierLow === '未上大学' && this.state.universityTierHigh === '未上大学';
    const blockClass = isFailure ? 'warning' : 'success';

    let conclusionText = '';
    if (isFailure) conclusionText = '根据当前数据，升入大学的可能性较低';
    else conclusionText = '预测大学可能为：' + tierText;

    html += `
      <div class="prediction-block ${blockClass}">
        <div class="prediction-label">预测结论</div>
        <div class="prediction-value">${conclusionText}</div>
        <div class="prediction-detail">以上为基于当前数据的推测，实际录取受考试发挥、志愿填报、政策变化等多种因素影响。</div>
      </div>
    `;

    container.innerHTML = html;
  },

  // ============================================
  // 第4步：选专业 + 赛道
  // ============================================
  renderMajorGrid() {
    const container = document.getElementById('major-grid');
    if (!container) return;
    container.innerHTML = '';
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

  toggleMajor(index) {
    const major = DATA.majors[index];

    if (major.category === '暂不确定') {
      this.state.selectedMajors = [index];
      document.querySelectorAll('.major-card').forEach((c, i) => {
        c.classList.toggle('selected', i === index);
      });
      return;
    }

    const card = document.querySelector(`.major-card[data-major="${index}"]`);

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

  // ============================================
  // 第5步：结果页
  // ============================================
  renderResult() {
    const province = DATA.provinces.find(p => p.name === this.state.province);
    const isJunior = this.state.stage === 'junior';

    // 计算大学预测区间
    let tierLow = '', tierHigh = '';
    let pathLow = '', pathHigh = '';
    let seniorRankLow = 0, seniorRankHigh = 0;

    if (isJunior) {
      if (this.state.canEnterHighSchool !== 'unlikely') {
        const hsName = this.state.selectedHighSchool;
        const rankRange = this.queryRankMapping(hsName, this.state.highSchoolRankPercent, 'senior');
        seniorRankLow = rankRange.low;
        seniorRankHigh = rankRange.high;
        const tierRange = this.calcUniversityTierRange(rankRange.low, rankRange.high, province);
        tierLow = tierRange.tierLow;
        tierHigh = tierRange.tierHigh;
        pathLow = tierRange.pathLow;
        pathHigh = tierRange.pathHigh;
      } else {
        tierLow = '未上大学';
        tierHigh = '未上大学';
        pathLow = '初中毕业即就业';
        pathHigh = '初中毕业即就业';
      }
    } else {
      tierLow = this.state.universityTierLow;
      tierHigh = this.state.universityTierHigh;
      pathLow = this.state.universityPathNameLow;
      pathHigh = this.state.universityPathNameHigh;
      seniorRankLow = this.state.seniorRankLow;
      seniorRankHigh = this.state.seniorRankHigh;
    }

    // 查询社会阶层矩阵（用上限对应的路径）
    const cityLevel = this.state.cityLevel;
    const track = this.state.track;
    const eduKeyHigh = this.getEducationKey(pathHigh);
    const eduKeyLow = this.getEducationKey(pathLow);

    const societyDataHigh = this.querySocietyMatrix(cityLevel, eduKeyHigh, track);
    const societyDataLow = this.querySocietyMatrix(cityLevel, eduKeyLow, track);

    // 计算专业加权
    const majorInfo = this.calcMajorFactor();

    // 渲染标题
    const titleEl = document.getElementById('result-main-title');
    if (titleEl) {
      titleEl.textContent = `${this.state.province}（${cityLevel}）${track}路径预测`;
    }

    // 构建路径时间轴
    const timelineEl = document.getElementById('result-timeline');
    if (timelineEl) {
      timelineEl.innerHTML = this.buildTimeline(isJunior, province, tierLow, tierHigh, societyDataHigh, majorInfo);
    }

    // 最终结论卡片
    const finalCardEl = document.getElementById('final-card');
    if (finalCardEl) {
      finalCardEl.style.display = 'block';
      finalCardEl.innerHTML = this.buildConclusionCard(
        tierLow, tierHigh, societyDataLow, societyDataHigh, majorInfo, cityLevel, track
      );
    }

    // 金字塔
    const pyramidSection = document.getElementById('pyramid-section');
    if (pyramidSection) pyramidSection.style.display = 'block';

    // 专业加权
    if (majorInfo.selectedMajorNames.length > 0) {
      const majorSection = document.getElementById('major-bonus-section');
      if (majorSection) {
        majorSection.style.display = 'block';
        const majorText = document.getElementById('major-bonus-text');
        if (majorText) majorText.textContent = majorInfo.majorDesc;
      }
    } else {
      const majorSection = document.getElementById('major-bonus-section');
      if (majorSection) majorSection.style.display = 'none';
    }
  },

  buildTimeline(isJunior, province, tierLow, tierHigh, societyData, majorInfo) {
    let nodes = [];

    const schoolLevels = isJunior ? DATA.juniorSchoolLevels : DATA.seniorSchoolLevels;
    const currentSchool = schoolLevels[this.state.schoolLevel]
      ? schoolLevels[this.state.schoolLevel].name
      : '未知';
    nodes.push({
      title: '当前学校',
      desc: `${currentSchool}，年级排名前${this.state.rankPercent}%`,
      status: 'info'
    });

    if (isJunior) {
      const highSchoolRatePercent = (province.highSchoolRate * 100).toFixed(1);
      const rankLowStr = this.state.juniorRankLow.toFixed(1);
      const rankHighStr = this.state.juniorRankHigh.toFixed(1);

      if (this.state.canEnterHighSchool !== 'unlikely') {
        nodes.push({
          title: '中考预测',
          desc: `预测省排名前${rankLowStr}%-${rankHighStr}%之间，该省升学率${highSchoolRatePercent}%，推测能升入${this.formatTierRange(this.state.predictedHighSchoolLow, this.state.predictedHighSchoolHigh)}`,
          status: 'success'
        });
        nodes.push({
          title: '高中阶段',
          desc: `${this.state.selectedHighSchool}，预计排名前${this.state.highSchoolRankPercent}%`,
          status: 'info'
        });
      } else {
        nodes.push({
          title: '中考预测',
          desc: `预测省排名前${rankLowStr}%-${rankHighStr}%之间，该省升学率${highSchoolRatePercent}%，升入普高可能性较低`,
          status: 'warning'
        });
      }
    } else {
      const rankLowStr = this.state.seniorRankLow.toFixed(1);
      const rankHighStr = this.state.seniorRankHigh.toFixed(1);
      const tierText = this.formatTierRange(tierLow, tierHigh);
      const isFailure = tierLow === '未上大学' && tierHigh === '未上大学';
      nodes.push({
        title: '高考预测',
        desc: `预测省排名前${rankLowStr}%-${rankHighStr}%之间，预测大学可能为：${tierText}`,
        status: isFailure ? 'warning' : 'success'
      });
    }

    if (!(tierLow === '未上大学' && tierHigh === '未上大学')) {
      nodes.push({
        title: '大学预测',
        desc: `可能为${this.formatTierRange(tierLow, tierHigh)}`,
        status: 'success'
      });
    }

    // 就业预测（使用新数据）
    if (societyData) {
      nodes.push({
        title: '就业预测',
        desc: `起薪约 ${societyData.startSalary}元/月，${societyData.classLevel}`,
        status: 'info'
      });
    }

    let html = '<h3 class="section-title">教育路径时间轴</h3>';
    html += '<div class="timeline">';
    nodes.forEach(node => {
      html += `
        <div class="timeline-node ${node.status || ''}">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <div class="timeline-title">${node.title}</div>
            <div class="timeline-desc">${node.desc}</div>
          </div>
        </div>
      `;
    });
    html += '</div>';
    return html;
  },

  buildConclusionCard(tierLow, tierHigh, societyDataLow, societyDataHigh, majorInfo, cityLevel, track) {
    // 未上大学的情况
    if (tierLow === '未上大学' && tierHigh === '未上大学') {
      return `
        <div class="final-card-title">最终结论</div>
        <div class="final-card-tier">可能无法升入大学</div>
        <div class="final-card-grid">
          <div class="final-card-item" style="grid-column: span 2;">
            <div class="final-card-item-label">建议</div>
            <div class="final-card-item-value">建议关注职业教育或技能培训路径</div>
          </div>
        </div>
        <div class="final-card-ceiling">
          <strong>数据来源：</strong>各省教育考试院录取数据、2026年中国毕业生社会阶层与生存状态矩阵。以上结论仅供参考。
        </div>
      `;
    }

    // 使用 societyDataHigh 作为主展示数据
    const sd = societyDataHigh;
    if (!sd) {
      return '<p>暂无足够数据生成结论</p>';
    }

    const tierText = this.formatTierRange(tierLow, tierHigh);

    // 起薪（考虑专业加权）
    let salaryDisplay = sd.startSalary;
    if (majorInfo.selectedMajorNames.length > 0 && majorInfo.majorFactor !== 1.0) {
      // 解析起薪范围并应用加权
      const salaryMatch = sd.startSalary.match(/(\d+)-(\d+)/);
      if (salaryMatch) {
        const low = Math.round(parseInt(salaryMatch[1]) * majorInfo.majorFactor);
        const high = Math.round(parseInt(salaryMatch[2]) * majorInfo.majorFactor);
        salaryDisplay = `${low}-${high}（含专业加权）`;
      }
    }

    let html = `
      <div class="final-card-title">最终结论</div>
      <div class="final-card-tier">${cityLevel} · ${track} · ${tierText}</div>
      <div class="final-card-grid">
        <div class="final-card-item">
          <div class="final-card-item-label">毕业起薪预测</div>
          <div class="final-card-item-value">${salaryDisplay}元/月</div>
        </div>
        <div class="final-card-item">
          <div class="final-card-item-label">社会阶层定位</div>
          <div class="final-card-item-value">${sd.classLevel}</div>
        </div>
        <div class="final-card-item">
          <div class="final-card-item-label">起点阶层</div>
          <div class="final-card-item-value">${sd.entryTier}</div>
        </div>
        <div class="final-card-item">
          <div class="final-card-item-label">奋斗上限</div>
          <div class="final-card-item-value">${sd.ceilingTier || '同起点或小幅上升'}</div>
        </div>
      </div>
    `;

    // 35岁状态
    html += `
      <div class="final-card-career"><strong>35岁典型状态：</strong>${sd.age35Status}</div>
    `;

    // 房产状态
    html += `
      <div class="final-card-career"><strong>房产状态：</strong>${sd.housingStatus}</div>
    `;

    // 向上突破
    html += `
      <div class="final-card-career"><strong>向上突破概率：</strong>${sd.breakthroughProbability}</div>
    `;

    // 突破通道
    html += `
      <div class="final-card-career"><strong>突破通道：</strong>${sd.breakthroughPath}</div>
    `;

    html += `
      <div class="final-card-ceiling">
        <strong>数据来源：</strong>各省教育考试院录取数据、2026年中国毕业生社会阶层与生存状态矩阵。以上结论仅供参考。
      </div>
    `;

    return html;
  },

  // ============================================
  // 辅助函数
  // ============================================
  calcMajorFactor() {
    let majorFactor = 1.0;
    let majorDesc = '';
    let selectedMajorNames = [];

    if (this.state.selectedMajors.length > 0) {
      const factors = this.state.selectedMajors.map(i => DATA.majors[i].factor);
      majorFactor = factors.reduce((a, b) => a + b, 0) / factors.length;
      selectedMajorNames = this.state.selectedMajors.map(i => DATA.majors[i].category);
      majorDesc = `已选专业：${selectedMajorNames.join('、')}，加权系数 ${majorFactor.toFixed(2)}`;
    }

    return { majorFactor, majorDesc, selectedMajorNames };
  },

  // ============================================
  // 重置
  // ============================================
  resetInput() {
    this.state.currentStep = 1;
    this.state.province = '';
    this.state.stage = '';
    this.state.schoolLevel = -1;
    this.state.rankTotal = '';
    this.state.rankPosition = '';
    this.state.rankPercent = 0;
    this.state.juniorRankLow = 0;
    this.state.juniorRankHigh = 0;
    this.state.canEnterHighSchool = '';
    this.state.predictedHighSchoolLow = '';
    this.state.predictedHighSchoolHigh = '';
    this.state.selectedHighSchool = '';
    this.state.highSchoolRankPercent = 0;
    this.state.seniorRankLow = 0;
    this.state.seniorRankHigh = 0;
    this.state.universityTierLow = '';
    this.state.universityTierHigh = '';
    this.state.universityPathNameLow = '';
    this.state.universityPathNameHigh = '';
    this.state.cityLevel = '';
    this.state.track = '体制外';
    this.state.selectedMajors = [];

    const provinceSelect = document.getElementById('province-select');
    if (provinceSelect) provinceSelect.value = '';

    document.querySelectorAll('.stage-card').forEach(c => c.classList.remove('selected'));
    document.querySelectorAll('#school-cards .school-card').forEach(c => c.classList.remove('selected'));
    document.querySelectorAll('.major-card').forEach(c => c.classList.remove('selected'));
    document.querySelectorAll('.track-card').forEach(c => c.classList.remove('selected'));

    const totalInput = document.getElementById('rank-total');
    const positionInput = document.getElementById('rank-position');
    if (totalInput) totalInput.value = '';
    if (positionInput) positionInput.value = '';

    const resultEl = document.getElementById('rank-result');
    const percentEl = document.getElementById('rank-percent');
    const hintEl = document.getElementById('rank-hint');
    if (resultEl) resultEl.style.display = 'none';
    if (percentEl) percentEl.textContent = '\u2014';
    if (hintEl) hintEl.textContent = '请填写总人数和排名';

    document.querySelectorAll('.step-content').forEach(s => s.classList.remove('active'));
    const step1 = document.querySelector('.step-content[data-step="1"]');
    if (step1) step1.classList.add('active');

    this.updateStepProgress();

    const step1Btn = document.querySelector('.step-content[data-step="1"] .btn-next');
    if (step1Btn) step1Btn.disabled = true;

    const juniorContent = document.getElementById('junior-prediction-content');
    if (juniorContent) juniorContent.innerHTML = '';
    const seniorContent = document.getElementById('senior-prediction-content');
    if (seniorContent) seniorContent.innerHTML = '';

    const finalCard = document.getElementById('final-card');
    if (finalCard) finalCard.style.display = 'none';
    const pyramidSection = document.getElementById('pyramid-section');
    if (pyramidSection) pyramidSection.style.display = 'none';
    const majorSection = document.getElementById('major-bonus-section');
    if (majorSection) majorSection.style.display = 'none';
    const timelineEl = document.getElementById('result-timeline');
    if (timelineEl) timelineEl.innerHTML = '';
  },

  // ============================================
  // 其他功能
  // ============================================
  changeAssumption() {
    this.goToPage('input');
  },

  share() {
    const text = '我在「未来之路·教育路径模拟器」测试了我的教育路径预测，快来试试吧！';
    if (navigator.share) {
      navigator.share({ title: '未来之路·教育路径模拟器', text });
    } else {
      alert('已复制分享文案：' + text);
    }
  },

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

document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
