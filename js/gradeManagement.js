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
            // // 学习资源使用情况
            // resourceUsage: parseInt(document.getElementById('resource-usage').value),
            // experimentTime: parseInt(document.getElementById('experiment-time').value),

            // 综合素质评价
            qualityTheory: parseInt(document.getElementById('quality-theory').value),
            qualityDrone: parseInt(document.getElementById('quality-drone').value),
            qualitySoftware: parseInt(document.getElementById('quality-software').value),
            qualityInterpretation: parseInt(document.getElementById('quality-interpretation').value),
            qualityWorkflow: parseInt(document.getElementById('quality-workflow').value),
            qualityTeamwork: parseInt(document.getElementById('quality-teamwork').value),
            qualitySelfLearning: parseInt(document.getElementById('quality-self-learning').value),
            qualityEthics: parseInt(document.getElementById('quality-ethics').value),

            // 项目成绩
            projects: {
                project1: {
                    teacher: parseFloat(document.getElementById('project1-teacher').value) || 0,
                    enterprise: parseFloat(document.getElementById('project1-enterprise').value) || 0,
                    group: parseFloat(document.getElementById('project1-group').value) || 0,
                    experimentCount: parseInt(document.getElementById('project1-count').value) || 0,
                    experimentTime: parseInt(document.getElementById('project1-time').value) || 0
                },
                project2: {
                    teacher: parseFloat(document.getElementById('project2-teacher').value) || 0,
                    enterprise: parseFloat(document.getElementById('project2-enterprise').value) || 0,
                    group: parseFloat(document.getElementById('project2-group').value) || 0,
                    experimentCount: parseInt(document.getElementById('project2-count').value) || 0,
                    experimentTime: parseInt(document.getElementById('project2-time').value) || 0
                },
                project3: {
                    teacher: parseFloat(document.getElementById('project3-teacher').value) || 0,
                    enterprise: parseFloat(document.getElementById('project3-enterprise').value) || 0,
                    group: parseFloat(document.getElementById('project3-group').value) || 0,
                    experimentCount: parseInt(document.getElementById('project3-count').value) || 0,
                    experimentTime: parseInt(document.getElementById('project3-time').value) || 0
                },
                project4: {
                    teacher: parseFloat(document.getElementById('project4-teacher').value) || 0,
                    enterprise: parseFloat(document.getElementById('project4-enterprise').value) || 0,
                    group: parseFloat(document.getElementById('project4-group').value) || 0,
                    experimentCount: parseInt(document.getElementById('project4-count').value) || 0,
                    experimentTime: parseInt(document.getElementById('project4-time').value) || 0
                },
                project5: {
                    teacher: parseFloat(document.getElementById('project5-teacher').value) || 0,
                    enterprise: parseFloat(document.getElementById('project5-enterprise').value) || 0,
                    group: parseFloat(document.getElementById('project5-group').value) || 0,
                    experimentCount: parseInt(document.getElementById('project5-count').value) || 0,
                    experimentTime: parseInt(document.getElementById('project5-time').value) || 0
                },
                project6: {
                    teacher: parseFloat(document.getElementById('project6-teacher').value) || 0,
                    enterprise: parseFloat(document.getElementById('project6-enterprise').value) || 0,
                    group: parseFloat(document.getElementById('project6-group').value) || 0,
                    experimentCount: parseInt(document.getElementById('project6-count').value) || 0,
                    experimentTime: parseInt(document.getElementById('project6-time').value) || 0
                }
            }
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

    // 综合素质评价
    document.getElementById('quality-theory').value = grade.qualityTheory || '';
    document.getElementById('quality-drone').value = grade.qualityDrone || '';
    document.getElementById('quality-software').value = grade.qualitySoftware || '';
    document.getElementById('quality-interpretation').value = grade.qualityInterpretation || '';
    document.getElementById('quality-workflow').value = grade.qualityWorkflow || '';
    document.getElementById('quality-teamwork').value = grade.qualityTeamwork || '';
    document.getElementById('quality-self-learning').value = grade.qualitySelfLearning || '';
    document.getElementById('quality-ethics').value = grade.qualityEthics || '';

    // 填充项目成绩
    if (grade.projects) {
        // 项目一
        if (grade.projects.project1) {
            document.getElementById('project1-teacher').value = grade.projects.project1.teacher || '';
            document.getElementById('project1-enterprise').value = grade.projects.project1.enterprise || '';
            document.getElementById('project1-group').value = grade.projects.project1.group || '';
            document.getElementById('project1-count').value = grade.projects.project1.experimentCount || '';
            document.getElementById('project1-time').value = grade.projects.project1.experimentTime || '';
        }

        // 项目二
        if (grade.projects.project2) {
            document.getElementById('project2-teacher').value = grade.projects.project2.teacher || '';
            document.getElementById('project2-enterprise').value = grade.projects.project2.enterprise || '';
            document.getElementById('project2-group').value = grade.projects.project2.group || '';
            document.getElementById('project2-count').value = grade.projects.project2.experimentCount || '';
            document.getElementById('project2-time').value = grade.projects.project2.experimentTime || '';
        }

        // 项目三
        if (grade.projects.project3) {
            document.getElementById('project3-teacher').value = grade.projects.project3.teacher || '';
            document.getElementById('project3-enterprise').value = grade.projects.project3.enterprise || '';
            document.getElementById('project3-group').value = grade.projects.project3.group || '';
            document.getElementById('project3-count').value = grade.projects.project3.experimentCount || '';
            document.getElementById('project3-time').value = grade.projects.project3.experimentTime || '';
        }

        // 项目四
        if (grade.projects.project4) {
            document.getElementById('project4-teacher').value = grade.projects.project4.teacher || '';
            document.getElementById('project4-enterprise').value = grade.projects.project4.enterprise || '';
            document.getElementById('project4-group').value = grade.projects.project4.group || '';
            document.getElementById('project4-count').value = grade.projects.project4.experimentCount || '';
            document.getElementById('project4-time').value = grade.projects.project4.experimentTime || '';
        }

        // 项目五
        if (grade.projects.project5) {
            document.getElementById('project5-teacher').value = grade.projects.project5.teacher || '';
            document.getElementById('project5-enterprise').value = grade.projects.project5.enterprise || '';
            document.getElementById('project5-group').value = grade.projects.project5.group || '';
            document.getElementById('project5-count').value = grade.projects.project5.experimentCount || '';
            document.getElementById('project5-time').value = grade.projects.project5.experimentTime || '';
        }

        // 项目六
        if (grade.projects.project6) {
            document.getElementById('project6-teacher').value = grade.projects.project6.teacher || '';
            document.getElementById('project6-enterprise').value = grade.projects.project6.enterprise || '';
            document.getElementById('project6-group').value = grade.projects.project6.group || '';
            document.getElementById('project6-count').value = grade.projects.project6.experimentCount || '';
            document.getElementById('project6-time').value = grade.projects.project6.experimentTime || '';
        }
    }
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

    // 计算各项目的总分
    const projectScores = [];
    if (grade.projects) {
        for (let i = 1; i <= 6; i++) {
            const projectKey = `project${i}`;
            if (grade.projects[projectKey]) {
                const project = grade.projects[projectKey];
                const total = calculateProjectScore(project);
                projectScores.push({
                    name: `项目${i}`,
                    teacher: project.teacher || 0,
                    enterprise: project.enterprise || 0,
                    group: project.group || 0,
                    total: total,
                    experimentCount: project.experimentCount || 0,
                    experimentTime: project.experimentTime || 0
                });
            } else {
                projectScores.push({
                    name: `项目${i}`,
                    teacher: 0,
                    enterprise: 0,
                    group: 0,
                    total: 0,
                    experimentCount: 0,
                    experimentTime: 0
                });
            }
        }
    }

    // 构建项目成绩HTML
    let projectsHtml = '';
    if (projectScores.length > 0) {
        projectsHtml = `
            <div class="row mt-4">
                <div class="col-md-12">
                    <h5 class="border-bottom pb-2 mb-3">项目成绩</h5>
                    <div class="table-responsive">
                        <table class="table table-bordered table-striped">
                            <thead class="table-light">
                                <tr>
                                    <th>项目</th>
                                    <th>教师评分</th>
                                    <th>企业评分</th>
                                    <th>小组评分</th>
                                    <th>实验次数</th>
                                    <th>实验时间(分钟)</th>
                                    <th>总评</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${projectScores.map(project => `
                                    <tr>
                                        <td>${project.name}</td>
                                        <td>${project.teacher}</td>
                                        <td>${project.enterprise}</td>
                                        <td>${project.group}</td>
                                        <td>${project.experimentCount}</td>
                                        <td>${project.experimentTime}</td>
                                        <td>
                                            <span class="badge rounded-pill bg-${getScoreBadgeColor(project.total)}">${project.total.toFixed(1)}</span>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    // 构建单元成绩HTML
    const unitHtml = `
        <div class="row mt-4">
            <div class="col-md-12">
                <h5 class="border-bottom pb-2 mb-3">单元成绩</h5>
                <div class="table-responsive">
                    <table class="table table-bordered table-striped">
                        <thead class="table-light">
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
                <div class="table-responsive mt-2">
                    <table class="table table-bordered table-striped">
                        <thead class="table-light">
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
    `;

    // 构建综合素质评价HTML
    const qualityHtml = `
        <div class="row mt-4">
            <div class="col-md-12">
                <h5 class="border-bottom pb-2 mb-3">综合素质评价 (1-5分)</h5>
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-2 d-flex justify-content-between">
                            <span>卫星遥感基础理论：</span>
                            <span class="fw-bold">${grade.qualityTheory || 0} 分</span>
                        </div>
                        <div class="mb-2 d-flex justify-content-between">
                            <span>无人机遥感知识：</span>
                            <span class="fw-bold">${grade.qualityDrone || 0} 分</span>
                        </div>
                        <div class="mb-2 d-flex justify-content-between">
                            <span>软件操作技能：</span>
                            <span class="fw-bold">${grade.qualitySoftware || 0} 分</span>
                        </div>
                        <div class="mb-2 d-flex justify-content-between">
                            <span>影像解译能力：</span>
                            <span class="fw-bold">${grade.qualityInterpretation || 0} 分</span>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-2 d-flex justify-content-between">
                            <span>规范化技术流程：</span>
                            <span class="fw-bold">${grade.qualityWorkflow || 0} 分</span>
                        </div>
                        <div class="mb-2 d-flex justify-content-between">
                            <span>团队协作：</span>
                            <span class="fw-bold">${grade.qualityTeamwork || 0} 分</span>
                        </div>
                        <div class="mb-2 d-flex justify-content-between">
                            <span>自学能力：</span>
                            <span class="fw-bold">${grade.qualitySelfLearning || 0} 分</span>
                        </div>
                        <div class="mb-2 d-flex justify-content-between">
                            <span>职业道德：</span>
                            <span class="fw-bold">${grade.qualityEthics || 0} 分</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // 构建成绩详情HTML
    const detailHTML = `
        <div class="container-fluid p-0">
            <div class="card mb-3">
                <div class="card-header bg-primary text-white">
                    <h5 class="mb-0">学生基本信息</h5>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <p><strong>姓名：</strong>${student.name}</p>
                            <p><strong>学号：</strong>${student.id}</p>
                            <p><strong>班级：</strong>${student.class}</p>
                        </div>
                        <div class="col-md-6">
                            <h5>总成绩：
                                <span class="badge rounded-pill bg-${getScoreBadgeColor(totalScore)}">
                                    ${totalScore.toFixed(1)}分
                                </span>
                            </h5>
                            <p><strong>平时成绩(20%)：</strong>${grade.usual || 0}分</p>
                            <p><strong>理论成绩(30%)：</strong>${grade.theory || 0}分</p>
                            <p><strong>实践成绩(20%)：</strong>${grade.practical || 0}分</p>
                            <p><strong>期末成绩(30%)：</strong>${grade.final || 0}分</p>
                        </div>
                    </div>
                </div>
            </div>
            
            ${projectsHtml}
            ${unitHtml}
            ${qualityHtml}
        </div>
    `;

    // 显示模态框
    document.getElementById('grade-detail-content').innerHTML = detailHTML;

    // 使用Bootstrap的Modal API显示模态框
    const modal = new bootstrap.Modal(document.getElementById('gradeDetailModal'));
    modal.show();
}

// 根据分数获取对应的徽章颜色
function getScoreBadgeColor(score) {
    if (score >= 90) return 'success';
    else if (score >= 80) return 'primary';
    else if (score >= 70) return 'info';
    else if (score >= 60) return 'warning';
    else return 'danger';
}

// 修改initGradeAnalysis函数
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

        setTimeout(function () {
            if (analysisType === 'individual') {
                // 个人分析
                if (selectedStudent) {
                    createRadarChart(selectedStudent);
                    // 移除饼图: createPieChart(selectedStudent);
                    createLineChart(selectedStudent);
                    // 移除直方图: createHistogram(selectedStudent);
                    createProjectHistogram(selectedStudent);
                    createProjectBubble(selectedStudent);
                } else {
                    clearCharts();
                }
            } else {
                // 班级分析
                if (selectedClass) {
                    createClassRadarChart(selectedClass);
                    // 移除饼图: createClassPieChart(selectedClass);
                    createClassLineChart(selectedClass);
                    // 移除直方图: createClassHistogram(selectedClass);
                    createClassProjectHistogram(selectedClass);
                    createClassProjectBubble(selectedClass);
                } else {
                    clearCharts();
                }
            }

            // 在所有图表创建完成后手动调整尺寸
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

        // 清除项目图表
        clearProjectHistogram();
        clearProjectBubble();
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

// 添加计算项目成绩的函数
function calculateProjectScore(project) {
    // 默认计算方式：教师评分40%，企业评分30%，小组评分30%
    const teacherScore = (project.teacher || 0) * 0.4;
    const enterpriseScore = (project.enterprise || 0) * 0.3;
    const groupScore = (project.group || 0) * 0.3;

    return teacherScore + enterpriseScore + groupScore;
}