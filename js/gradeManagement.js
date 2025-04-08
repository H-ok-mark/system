// 初始化成绩录入页面
function initGradeEntry() {
    const classSelector = document.getElementById('grade-entry-class');
    const studentSelector = document.getElementById('grade-entry-student');
    const gradeFormCard = document.getElementById('grade-entry-form-card');
    const gradeForm = document.getElementById('grade-entry-form');
    const resetBtn = document.getElementById('reset-grade-btn');
    const saveBtn = document.getElementById('save-grade-btn');

    // 填充班级选择器
    populateClassSelector(classSelector);

    // 班级选择变化
    classSelector.addEventListener('change', function () {
        const selectedClass = this.value;
        if (selectedClass) {
            // 获取班级学生
            const students = getStudentsByClass(selectedClass);

            // 清空并填充学生选择器
            studentSelector.innerHTML = '<option value="">请选择学生</option>';
            students.forEach(student => {
                const option = document.createElement('option');
                option.value = student.id;
                option.textContent = `${student.name} (${student.id})`;
                studentSelector.appendChild(option);
            });

            studentSelector.disabled = false;
        } else {
            // 重置学生选择器
            studentSelector.innerHTML = '<option value="">请先选择班级</option>';
            studentSelector.disabled = true;

            // 隐藏成绩表单
            gradeFormCard.style.display = 'none';
        }
    });

    // 学生选择变化
    studentSelector.addEventListener('change', function () {
        const selectedStudentId = this.value;
        if (selectedStudentId) {
            // 获取学生信息
            const student = getStudentById(selectedStudentId);

            // 更新学生信息显示
            document.getElementById('selected-student-info').textContent =
                `${student.name} (${student.id}) - ${student.class}`;

            // 显示成绩表单
            gradeFormCard.style.display = 'block';

            // 获取学生现有成绩
            const grade = getGradeByStudentId(selectedStudentId);
            if (grade) {
                // 填充表单
                fillGradeForm(grade);
            } else {
                // 重置表单
                resetGradeForm();
            }
        } else {
            // 隐藏成绩表单
            gradeFormCard.style.display = 'none';
        }
    });

    // 重置按钮
    resetBtn.addEventListener('click', function () {
        resetGradeForm();
    });

    // 保存成绩
    gradeForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const selectedStudentId = studentSelector.value;
        if (!selectedStudentId) {
            alert('请选择学生');
            return;
        }

        // 收集表单数据
        const gradeData = {
            studentId: selectedStudentId,
            // 成绩比例
            usual: parseFloat(document.getElementById('grade-usual').value),
            theory: parseFloat(document.getElementById('grade-theory').value),
            practical: parseFloat(document.getElementById('grade-practical').value),
            final: parseFloat(document.getElementById('grade-final').value),
            // 单元成绩
            unitBasic: parseFloat(document.getElementById('unit-basic').value),
            unitDrone: parseFloat(document.getElementById('unit-drone').value),
            unitGeometric: parseFloat(document.getElementById('unit-geometric').value),
            unitRadiometric: parseFloat(document.getElementById('unit-radiometric').value),
            unitRegistration: parseFloat(document.getElementById('unit-registration').value),
            unitVisual: parseFloat(document.getElementById('unit-visual').value),
            unitChange: parseFloat(document.getElementById('unit-change').value),
            unitClassification: parseFloat(document.getElementById('unit-classification').value),
            unitAccuracy: parseFloat(document.getElementById('unit-accuracy').value),
            unitMapping: parseFloat(document.getElementById('unit-mapping').value),
            // 学习资源使用情况
            resourceUsage: parseInt(document.getElementById('resource-usage').value),
            experimentTime: parseInt(document.getElementById('experiment-time').value),
            // 综合素质评价
            qualityTheory: parseInt(document.getElementById('quality-theory').value),
            qualityDrone: parseInt(document.getElementById('quality-drone').value),
            qualitySoftware: parseInt(document.getElementById('quality-software').value),
            qualityInterpretation: parseInt(document.getElementById('quality-interpretation').value),
            qualityWorkflow: parseInt(document.getElementById('quality-workflow').value),
            qualityTeamwork: parseInt(document.getElementById('quality-teamwork').value),
            qualitySelfLearning: parseInt(document.getElementById('quality-self-learning').value),
            qualityEthics: parseInt(document.getElementById('quality-ethics').value)
        };

        // 保存成绩
        addGrade(gradeData);

        alert('成绩保存成功');
    });
}

// 填充成绩表单
function fillGradeForm(grade) {
    // 成绩比例
    document.getElementById('grade-usual').value = grade.usual || '';
    document.getElementById('grade-theory').value = grade.theory || '';
    document.getElementById('grade-practical').value = grade.practical || '';
    document.getElementById('grade-final').value = grade.final || '';

    // 单元成绩
    document.getElementById('unit-basic').value = grade.unitBasic || '';
    document.getElementById('unit-drone').value = grade.unitDrone || '';
    document.getElementById('unit-geometric').value = grade.unitGeometric || '';
    document.getElementById('unit-radiometric').value = grade.unitRadiometric || '';
    document.getElementById('unit-registration').value = grade.unitRegistration || '';
    document.getElementById('unit-visual').value = grade.unitVisual || '';
    document.getElementById('unit-change').value = grade.unitChange || '';
    document.getElementById('unit-classification').value = grade.unitClassification || '';
    document.getElementById('unit-accuracy').value = grade.unitAccuracy || '';
    document.getElementById('unit-mapping').value = grade.unitMapping || '';

    // 学习资源使用情况
    document.getElementById('resource-usage').value = grade.resourceUsage || '';
    document.getElementById('experiment-time').value = grade.experimentTime || '';

    // 综合素质评价
    document.getElementById('quality-theory').value = grade.qualityTheory || '';
    document.getElementById('quality-drone').value = grade.qualityDrone || '';
    document.getElementById('quality-software').value = grade.qualitySoftware || '';
    document.getElementById('quality-interpretation').value = grade.qualityInterpretation || '';
    document.getElementById('quality-workflow').value = grade.qualityWorkflow || '';
    document.getElementById('quality-teamwork').value = grade.qualityTeamwork || '';
    document.getElementById('quality-self-learning').value = grade.qualitySelfLearning || '';
    document.getElementById('quality-ethics').value = grade.qualityEthics || '';
}

// 重置成绩表单
function resetGradeForm() {
    document.getElementById('grade-entry-form').reset();
}

// 初始化成绩查询页面
function initGradeQuery() {
    const classSelector = document.getElementById('query-class');
    const keywordInput = document.getElementById('query-keyword');
    const searchBtn = document.getElementById('query-btn');
    const gradeTable = document.getElementById('grade-list');

    // 填充班级选择器
    populateClassSelector(classSelector);

    // 查询按钮点击事件
    searchBtn.addEventListener('click', function () {
        searchGrades();
    });

    // 按Enter键查询
    keywordInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            searchGrades();
        }
    });

    // 班级选择变化时查询
    classSelector.addEventListener('change', function () {
        searchGrades();
    });

    // 初始加载所有成绩
    searchGrades();

    // 内部查询函数
    function searchGrades() {
        const selectedClass = classSelector.value;
        const keyword = keywordInput.value.trim().toLowerCase();

        // 获取所有学生和成绩
        let students = getStudents();
        const grades = getGrades();

        // 按班级筛选
        if (selectedClass) {
            students = students.filter(student => student.class === selectedClass);
        }

        // 按关键字筛选
        if (keyword) {
            students = students.filter(student =>
                student.name.toLowerCase().includes(keyword) ||
                student.id.toLowerCase().includes(keyword)
            );
        }

        // 清空表格
        gradeTable.innerHTML = '';

        // 填充表格
        students.forEach(student => {
            const grade = grades.find(g => g.studentId === student.id);

            const row = document.createElement('tr');

            // 计算总评
            let totalScore = 0;
            if (grade) {
                totalScore = calculateTotalScore(grade);
            }

            row.innerHTML = `
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.class}</td>
                <td>${grade ? grade.usual : '未录入'}</td>
                <td>${grade ? grade.theory : '未录入'}</td>
                <td>${grade ? grade.practical : '未录入'}</td>
                <td>${grade ? grade.final : '未录入'}</td>
                <td>${grade ? totalScore.toFixed(1) : '未录入'}</td>
                <td>
                    ${grade ?
                    `<button class="btn btn-sm btn-info view-grade-btn" data-student-id="${student.id}">
                            <i class="bi bi-eye"></i> 查看
                        </button>` :
                    `<span class="badge bg-warning">未录入</span>`
                }
                </td>
            `;

            gradeTable.appendChild(row);
        });

        // 绑定查看按钮事件
        const viewButtons = document.querySelectorAll('.view-grade-btn');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', function () {
                const studentId = this.getAttribute('data-student-id');
                showGradeDetail(studentId);
            });
        });
    }
}

// 显示成绩详情
function showGradeDetail(studentId) {
    const student = getStudentById(studentId);
    const grade = getGradeByStudentId(studentId);

    if (!student || !grade) {
        return;
    }

    const totalScore = calculateTotalScore(grade);

    // 构建成绩详情HTML
    const detailHTML = `
        <div class="row">
            <div class="col-md-6">
                <h5>学生信息</h5>
                <p><strong>姓名：</strong>${student.name}</p>
                <p><strong>学号：</strong>${student.id}</p>
                <p><strong>班级：</strong>${student.class}</p>
            </div>
            <div class="col-md-6">
                <h5>总成绩：${totalScore.toFixed(1)}分</h5>
                <p><strong>平时成绩(20%)：</strong>${grade.usual}分</p>
                <p><strong>理论成绩(30%)：</strong>${grade.theory}分</p>
                <p><strong>实践成绩(20%)：</strong>${grade.practical}分</p>
                <p><strong>期末成绩(30%)：</strong>${grade.final}分</p>
            </div>
        </div>
        
        <div class="row mt-3">
            <div class="col-md-12">
                <h5>单元成绩</h5>
                <div class="table-responsive">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>遥感基础知识</th>
                                <th>无人机数据获取</th>
                                <th>几何校正</th>
                                <th>辐射校正</th>
                                <th>图像配准</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${grade.unitBasic || 0}</td>
                                <td>${grade.unitDrone || 0}</td>
                                <td>${grade.unitGeometric || 0}</td>
                                <td>${grade.unitRadiometric || 0}</td>
                                <td>${grade.unitRegistration || 0}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="table-responsive">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>目视解译</th>
                                <th>变化监测</th>
                                <th>图像分类</th>
                                <th>精度评价</th>
                                <th>专题制图</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${grade.unitVisual || 0}</td>
                                <td>${grade.unitChange || 0}</td>
                                <td>${grade.unitClassification || 0}</td>
                                <td>${grade.unitAccuracy || 0}</td>
                                <td>${grade.unitMapping || 0}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        
        <div class="row mt-3">
            <div class="col-md-6">
                <h5>学习资源使用情况</h5>
                <p><strong>学习资源使用次数：</strong>${grade.resourceUsage || 0}次</p>
                <p><strong>实验完成时间：</strong>${grade.experimentTime || 0}分钟</p>
            </div>
            <div class="col-md-6">
                <h5>综合素质评价 (1-5分)</h5>
                <div class="row">
                    <div class="col-md-6">
                        <p><strong>卫星遥感基础理论：</strong>${grade.qualityTheory || 0}</p>
                        <p><strong>无人机遥感知识：</strong>${grade.qualityDrone || 0}</p>
                        <p><strong>软件操作技能：</strong>${grade.qualitySoftware || 0}</p>
                        <p><strong>影像解译能力：</strong>${grade.qualityInterpretation || 0}</p>
                    </div>
                    <div class="col-md-6">
                        <p><strong>规范化技术流程：</strong>${grade.qualityWorkflow || 0}</p>
                        <p><strong>团队协作：</strong>${grade.qualityTeamwork || 0}</p>
                        <p><strong>自学能力：</strong>${grade.qualitySelfLearning || 0}</p>
                        <p><strong>职业道德：</strong>${grade.qualityEthics || 0}</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    // 显示模态框
    document.getElementById('grade-detail-content').innerHTML = detailHTML;

    // 使用Bootstrap的Modal API显示模态框
    const modal = new bootstrap.Modal(document.getElementById('gradeDetailModal'));
    modal.show();
}

// 初始化成绩分析页面
function initGradeAnalysis() {
    const classSelector = document.getElementById('analysis-class');
    const studentSelector = document.getElementById('analysis-student');
    const analysisTypeSelector = document.getElementById('analysis-type');

    // 填充班级选择器
    populateClassSelector(classSelector);

    // 班级选择变化
    classSelector.addEventListener('change', function () {
        const selectedClass = this.value;

        // 清空并填充学生选择器
        studentSelector.innerHTML = '<option value="">请选择学生</option>';

        if (selectedClass) {
            // 获取班级学生
            const students = getStudentsByClass(selectedClass);

            students.forEach(student => {
                const option = document.createElement('option');
                option.value = student.id;
                option.textContent = `${student.name} (${student.id})`;
                studentSelector.appendChild(option);
            });
        }

        // 更新图表
        updateAnalysisCharts();
    });

    // 学生选择变化
    studentSelector.addEventListener('change', function () {
        // 更新图表
        updateAnalysisCharts();
    });

    // 分析类型变化
    analysisTypeSelector.addEventListener('change', function () {
        // 更新图表
        updateAnalysisCharts();
    });

    // 初始更新图表
    updateAnalysisCharts();

    // 内部更新图表函数
    function updateAnalysisCharts() {
        const selectedClass = classSelector.value;
        const selectedStudent = studentSelector.value;
        const analysisType = analysisTypeSelector.value;

        if (analysisType === 'individual') {
            // 个人分析
            if (selectedStudent) {
                // 创建个人雷达图
                createRadarChart(selectedStudent);
                // 创建个人饼图
                createPieChart(selectedStudent);
                // 创建个人折线图
                createLineChart(selectedStudent);
                // 创建个人直方图
                createHistogram(selectedStudent);
            } else {
                // 清空图表
                clearCharts();
            }
        } else {
            // 班级分析
            if (selectedClass) {
                // 创建班级雷达图
                createClassRadarChart(selectedClass);
                // 创建班级饼图
                createClassPieChart(selectedClass);
                // 创建班级折线图
                createClassLineChart(selectedClass);
                // 创建班级直方图
                createClassHistogram(selectedClass);
            } else {
                // 清空图表
                clearCharts();
            }
        }
        // 在初始化图表后统一尺寸
        setTimeout(function () {
            uniformChartSizes();
        }, 100);
    }

    // 清空所有图表
    function clearCharts() {
        if (window.radarChart) {
            window.radarChart.destroy();
            window.radarChart = null;
        }

        if (window.pieChart) {
            window.pieChart.destroy();
            window.pieChart = null;
        }

        if (window.lineChart) {
            window.lineChart.destroy();
            window.lineChart = null;
        }

        if (window.histogramChart) {
            window.histogramChart.destroy();
            window.histogramChart = null;
        }
    }
}

// 填充班级选择器
function populateClassSelector(selector) {
    // 清空选择器
    selector.innerHTML = '<option value="">请选择班级</option>';

    // 获取所有班级
    const classes = getClasses();

    // 添加班级选项
    classes.forEach(cls => {
        const option = document.createElement('option');
        option.value = cls.name;
        option.textContent = cls.name;
        selector.appendChild(option);
    });
}

// 计算总成绩
function calculateTotalScore(grade) {
    const usual = grade.usual * 0.2;
    const theory = grade.theory * 0.3;
    const practical = grade.practical * 0.2;
    const final = grade.final * 0.3;

    return usual + theory + practical + final;
}