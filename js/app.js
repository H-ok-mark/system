document.addEventListener('DOMContentLoaded', function () {
    // 初始化数据存储
    initializeStorage();

    // 设置侧边栏切换
    setupSidebarToggle();

    // 侧边栏菜单点击事件
    const menuItems = document.querySelectorAll('.sidebar-menu > li');
    menuItems.forEach(item => {
        item.addEventListener('click', function (e) {
            // 阻止事件冒泡
            e.stopPropagation();

            // 检查是否有子菜单
            const hasSubmenu = this.querySelector('.submenu') !== null;

            // 如果点击的是有子菜单的项目，并且不是点击子菜单本身
            if (hasSubmenu && e.target !== this.querySelector('.submenu') && !e.target.closest('.submenu')) {
                // 切换子菜单显示状态
                const submenu = this.querySelector('.submenu');
                if (submenu) {
                    submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';

                    // 如果是展开子菜单，则自动点击第一个子项
                    if (submenu.style.display === 'block') {
                        const firstSubItem = submenu.querySelector('li');
                        if (firstSubItem) {
                            // 清除所有激活状态
                            menuItems.forEach(i => i.classList.remove('active'));
                            document.querySelectorAll('.submenu li').forEach(i => i.classList.remove('active'));

                            // 设置父项和第一个子项为激活状态
                            this.classList.add('active');
                            firstSubItem.classList.add('active');

                            // 加载对应页面
                            const page = firstSubItem.getAttribute('data-page');
                            loadPage(page);

                            // 阻止下面的代码执行
                            return;
                        }
                    }
                }
            } else if (!e.target.closest('.submenu')) {
                // 如果点击的是没有子菜单的项目，或者点击的是子菜单以外的区域

                // 清除所有激活状态
                menuItems.forEach(i => i.classList.remove('active'));
                document.querySelectorAll('.submenu li').forEach(i => i.classList.remove('active'));

                // 设置当前项目为激活状态
                this.classList.add('active');

                // 加载相应页面
                const page = this.getAttribute('data-page');
                loadPage(page);
            }
        });
    });

    // 子菜单项点击事件
    const submenuItems = document.querySelectorAll('.submenu li');
    submenuItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.stopPropagation(); // 防止事件冒泡

            // 清除所有子菜单项的激活状态
            submenuItems.forEach(i => i.classList.remove('active'));

            // 设置当前子菜单项为激活状态
            this.classList.add('active');

            // 确保父菜单项也是激活状态
            const parentMenuItem = this.closest('.sidebar-menu > li');
            if (parentMenuItem) {
                menuItems.forEach(i => i.classList.remove('active'));
                parentMenuItem.classList.add('active');
            }

            // 加载相应页面
            const page = this.getAttribute('data-page');
            loadPage(page);
        });
    });

    // 在页面初始加载或刷新时，执行一次点击事件（首页）
    document.querySelector('.sidebar-menu li[data-page="dashboard"]').click();
});
// 加载页面内容
function loadPage(page) {
    const pageContainer = document.getElementById('page-container');

    // 根据页面名称生成对应的HTML内容
    let content = '';

    switch (page) {
        case 'dashboard':
            content = generateDashboardContent();
            break;
        case 'class-management':
            content = generateClassManagementContent();
            break;
        case 'student-info':
            content = generateStudentInfoContent();
            break;
        case 'grade-entry':
            content = generateGradeEntryContent();
            break;
        case 'grade-query':
            content = generateGradeQueryContent();
            break;
        case 'grade-analysis':
            content = generateGradeAnalysisContent();
            break;
        case 'personal-info':
            content = generatePersonalInfoContent();
            break;
        case 'change-password':
            content = generateChangePasswordContent();
            break;
        case 'system-management':
            content = generateSystemManagementContent();
            break;
        default:
            content = generateDashboardContent();
    }

    // 更新页面内容
    pageContainer.innerHTML = content;

    // 页面加载后的初始化操作
    switch (page) {
        case 'dashboard':
            initDashboard();
            break;
        case 'class-management':
            initClassManagement();
            break;
        case 'student-info':
            initStudentInfo();
            break;
        case 'grade-entry':
            initGradeEntry();
            break;
        case 'grade-query':
            initGradeQuery();
            break;
        case 'grade-analysis':
            initGradeAnalysis();
            // 确保正确初始化图表查看功能
            setTimeout(() => {
                if (typeof reinitChartViewer === 'function') {
                    reinitChartViewer();
                }
            }, 500);
            break;
        case 'personal-info':
            initPersonalInfo();
            break;
        case 'change-password':
            initChangePassword();
            break;
        case 'system-management':
            initSystemManagement();
            break;
    }
}

// 添加侧边栏切换功能
function setupSidebarToggle() {
    const sidebarContainer = document.getElementById('sidebar-container');
    const sidebarCollapseBtn = document.getElementById('sidebar-collapse-btn');
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle');
    const mainContent = document.querySelector('.main-content');
    const backdrop = document.querySelector('.sidebar-backdrop');

    // 折叠/展开按钮点击事件
    if (sidebarCollapseBtn) {
        sidebarCollapseBtn.addEventListener('click', function () {
            sidebarContainer.classList.toggle('collapsed');
            sidebar.classList.toggle('sidebar-collapsed');

            // 图表重绘
            setTimeout(function () {
                uniformChartSizes();
            }, 300);
        });
    }

    // 小屏幕下的菜单按钮
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function () {
            if (window.innerWidth < 768) {
                sidebar.classList.toggle('show');

                // 创建遮罩(如果不存在)
                if (!backdrop) {
                    const newBackdrop = document.createElement('div');
                    newBackdrop.className = 'sidebar-backdrop';
                    document.body.appendChild(newBackdrop);

                    newBackdrop.addEventListener('click', function () {
                        sidebar.classList.remove('show');
                        this.classList.remove('show');
                    });
                }

                if (backdrop) backdrop.classList.toggle('show');
            }
        });
    }

    // 添加统一图表尺寸的函数
    function uniformChartSizes() {
        // 选择所有图表canvas元素
        const canvases = document.querySelectorAll('.chart-container canvas');

        // 设置统一高度和宽度
        canvases.forEach(canvas => {
            canvas.setAttribute('style', 'height: 300px !important; width: 100% !important; display: block !important;');
        });

        // 重绘所有图表
        if (window.radarChart) window.radarChart.resize();
        if (window.pieChart) window.pieChart.resize();
        if (window.lineChart) window.lineChart.resize();
        if (window.histogramChart) window.histogramChart.resize();
    }

    // 窗口大小改变时重绘图表
    window.addEventListener('resize', function () {
        // 延迟执行以避免频繁调用
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        this.resizeTimeout = setTimeout(function () {
            // 更新所有图表尺寸
            if (window.radarChart) window.radarChart.resize();
            if (window.pieChart) window.pieChart.resize();
            if (window.lineChart) window.lineChart.resize();
            if (window.histogramChart) window.histogramChart.resize();
            if (window.projectHistogramChart) window.projectHistogramChart.resize();
            if (window.projectBubbleChart) window.projectBubbleChart.resize();

            // 统一所有图表大小
            uniformChartSizes();
        }, 200);
    });
}

// 统一图表尺寸的函数
function uniformChartSizes() {
    // 选择所有图表canvas元素
    const canvases = document.querySelectorAll('.chart-container canvas');

    // 设置统一高度
    canvases.forEach(canvas => {
        // 强制设置固定高度
        canvas.style.height = '350px';
        canvas.style.width = '100%';

        // 重设CSS样式优先级
        canvas.setAttribute('style', 'height: 300px !important; width: 100% !important; display: block !important;');
    });

    // 重绘所有图表
    if (window.radarChart) window.radarChart.resize();
    if (window.pieChart) window.pieChart.resize();
    if (window.lineChart) window.lineChart.resize();
    if (window.histogramChart) window.histogramChart.resize();
}

// 修改窗口大小事件处理器
window.addEventListener('resize', function () {
    // 延迟执行以避免频繁调用
    if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(function () {
        uniformChartSizes();
    }, 200);
});

// 生成主页内容
function generateDashboardContent() {
    return `
        <div class="container">
            <h2 class="mb-4">系统概览</h2>
            <div class="row">
                <div class="col-md-3">
                    <div class="dashboard-card">
                        <i class="bi bi-people text-primary"></i>
                        <div class="dashboard-card-count" id="total-classes">0</div>
                        <div class="dashboard-card-title">班级总数</div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="dashboard-card">
                        <i class="bi bi-person text-success"></i>
                        <div class="dashboard-card-count" id="total-students">0</div>
                        <div class="dashboard-card-title">学生总数</div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="dashboard-card">
                        <i class="bi bi-journal-check text-warning"></i>
                        <div class="dashboard-card-count" id="total-grades">0</div>
                        <div class="dashboard-card-title">已录入成绩数</div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="dashboard-card">
                        <i class="bi bi-graph-up text-danger"></i>
                        <div class="dashboard-card-count" id="avg-score">0</div>
                        <div class="dashboard-card-title">平均成绩</div>
                    </div>
                </div>
            </div>
            
            <div class="row mt-4">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">
                            班级成绩分布
                        </div>
                        <div class="card-body">
                            <canvas id="class-scores-chart"></canvas>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    `;
}
{/* <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">
                            成绩趋势分析
                        </div>
                        <div class="card-body">
                            <canvas id="score-trend-chart"></canvas>
                        </div>
                    </div>
                </div> */}

// 生成班级管理内容
function generateClassManagementContent() {
    return `
        <div class="container">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2>班级管理</h2>
                <button class="btn btn-primary" id="add-class-btn">
                    <i class="bi bi-plus"></i> 添加班级
                </button>
            </div>
            
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover" id="class-table">
                            <thead>
                                <tr>
                                    <th>班级ID</th>
                                    <th>班级名称</th>
                                    <th>学生人数</th>
                                    <th>创建时间</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody id="class-list">
                                <!-- 班级列表将在这里动态生成 -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 添加/编辑班级的模态框 -->
        <div class="modal fade" id="classModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="classModalTitle">添加班级</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="class-form">
                            <input type="hidden" id="class-id">
                            <div class="mb-3">
                                <label for="class-name" class="form-label">班级名称</label>
                                <input type="text" class="form-control" id="class-name" required>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-primary" id="save-class-btn">保存</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 生成学生信息内容
function generateStudentInfoContent() {
    return `
        <div class="container">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2>学生管理</h2>
                <button class="btn btn-primary" id="add-student-btn">
                    <i class="bi bi-plus"></i> 添加学生
                </button>
            </div>
            
            <div class="card mb-4">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label for="search-class" class="form-label">班级筛选</label>
                                <select class="form-select" id="search-class">
                                    <option value="">所有班级</option>
                                    <!-- 班级选项将在这里动态生成 -->
                                </select>
                            </div>
                        </div>
                        <div class="col-md-8">
                            <div class="mb-3">
                                <label for="search-keyword" class="form-label">关键字搜索</label>
                                <div class="input-group">
                                    <input type="text" class="form-control" id="search-keyword" placeholder="输入姓名或学号搜索">
                                    <button class="btn btn-outline-secondary" type="button" id="search-btn">
                                        <i class="bi bi-search"></i> 搜索
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover" id="student-table">
                            <thead>
                                <tr>
                                    <th>学号</th>
                                    <th>姓名</th>
                                    <th>性别</th>
                                    <th>班级</th>
                                    <th>联系方式</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody id="student-list">
                                <!-- 学生列表将在这里动态生成 -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 添加/编辑学生的模态框 -->
        <div class="modal fade" id="studentModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="studentModalTitle">添加学生</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="student-form">
                            <div class="row">
                                <div class="col-md-8">
                                    <div class="mb-3">
                                        <label for="student-id" class="form-label">学号</label>
                                        <input type="text" class="form-control" id="student-id" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="student-name" class="form-label">姓名</label>
                                        <input type="text" class="form-control" id="student-name" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">性别</label>
                                        <div>
                                            <div class="form-check form-check-inline">
                                                <input class="form-check-input" type="radio" name="student-gender" id="gender-male" value="男" checked>
                                                <label class="form-check-label" for="gender-male">男</label>
                                            </div>
                                            <div class="form-check form-check-inline">
                                                <input class="form-check-input" type="radio" name="student-gender" id="gender-female" value="女">
                                                <label class="form-check-label" for="gender-female">女</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label for="student-class" class="form-label">班级</label>
                                        <select class="form-select" id="student-class" required>
                                            <!-- 班级选项将在这里动态生成 -->
                                        </select>
                                    </div>
                                    <div class="mb-3">
                                        <label for="student-phone" class="form-label">联系方式</label>
                                        <input type="text" class="form-control" id="student-phone">
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="mb-3">
                                        <label class="form-label">照片</label>
                                        <div class="text-center">
                                            <img id="student-photo-preview" src="placeholder.jpg" alt="学生照片" class="img-fluid mb-2" style="max-height: 200px; border: 1px solid #ddd;">
                                            <input type="file" class="form-control" id="student-photo" accept="image/*">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-primary" id="save-student-btn">保存</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 生成成绩录入内容
function generateGradeEntryContent() {
    return `
        <div class="container">
            <h2 class="mb-4">成绩录入</h2>
            
            <div class="card mb-4">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="grade-entry-class" class="form-label">选择班级</label>
                                <select class="form-select" id="grade-entry-class">
                                    <option value="">请选择班级</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="grade-entry-student" class="form-label">选择学生</label>
                                <select class="form-select" id="grade-entry-student" disabled>
                                    <option value="">请先选择班级</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="card" id="grade-entry-form-card" style="display: none;">
                <div class="card-header">
                    <span id="selected-student-info">学生信息</span>
                </div>
                <div class="card-body">
                    <form id="grade-entry-form">
                        <div class="row">
                            <div class="col-md-3">
                                <div class="mb-3">
                                    <label for="grade-usual" class="form-label">平时成绩 (20%)</label>
                                    <input type="number" class="form-control" id="grade-usual" min="0" max="100" required>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="mb-3">
                                    <label for="grade-theory" class="form-label">理论成绩 (30%)</label>
                                    <input type="number" class="form-control" id="grade-theory" min="0" max="100" required>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="mb-3">
                                    <label for="grade-practical" class="form-label">实践成绩 (20%)</label>
                                    <input type="number" class="form-control" id="grade-practical" min="0" max="100" required>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="mb-3">
                                    <label for="grade-final" class="form-label">期末成绩 (30%)</label>
                                    <input type="number" class="form-control" id="grade-final" min="0" max="100" required>
                                </div>
                            </div>
                        </div>
                        
                        <h5 class="mt-4 mb-3">项目成绩</h5>
                        <div class="accordion" id="projectGradesAccordion">
                            <!-- 项目一 -->
                            <div class="accordion-item">
                                <h2 class="accordion-header" id="headingProject1">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseProject1" aria-expanded="false" aria-controls="collapseProject1">
                                        项目一成绩
                                    </button>
                                </h2>
                                <div id="collapseProject1" class="accordion-collapse collapse" aria-labelledby="headingProject1" data-bs-parent="#projectGradesAccordion">
                                    <div class="accordion-body">
                                        <div class="row">
                                            <div class="col-md-4">
                                                <div class="mb-3">
                                                    <label for="project1-teacher" class="form-label">教师评分</label>
                                                    <input type="number" class="form-control" id="project1-teacher" min="0" max="100">
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="mb-3">
                                                    <label for="project1-enterprise" class="form-label">企业评分</label>
                                                    <input type="number" class="form-control" id="project1-enterprise" min="0" max="100">
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="mb-3">
                                                    <label for="project1-group" class="form-label">小组评分</label>
                                                    <input type="number" class="form-control" id="project1-group" min="0" max="100">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="mb-3">
                                                    <label for="project1-count" class="form-label">实验次数</label>
                                                    <input type="number" class="form-control" id="project1-count" min="0">
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="mb-3">
                                                    <label for="project1-time" class="form-label">实验完成时间(分钟)</label>
                                                    <input type="number" class="form-control" id="project1-time" min="0">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- 项目二 -->
                            <div class="accordion-item">
                                <h2 class="accordion-header" id="headingProject2">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseProject2" aria-expanded="false" aria-controls="collapseProject2">
                                        项目二成绩
                                    </button>
                                </h2>
                                <div id="collapseProject2" class="accordion-collapse collapse" aria-labelledby="headingProject2" data-bs-parent="#projectGradesAccordion">
                                    <div class="accordion-body">
                                        <div class="row">
                                            <div class="col-md-4">
                                                <div class="mb-3">
                                                    <label for="project2-teacher" class="form-label">教师评分</label>
                                                    <input type="number" class="form-control" id="project2-teacher" min="0" max="100">
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="mb-3">
                                                    <label for="project2-enterprise" class="form-label">企业评分</label>
                                                    <input type="number" class="form-control" id="project2-enterprise" min="0" max="100">
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="mb-3">
                                                    <label for="project2-group" class="form-label">小组评分</label>
                                                    <input type="number" class="form-control" id="project2-group" min="0" max="100">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="mb-3">
                                                    <label for="project2-count" class="form-label">实验次数</label>
                                                    <input type="number" class="form-control" id="project2-count" min="0">
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="mb-3">
                                                    <label for="project2-time" class="form-label">实验完成时间(分钟)</label>
                                                    <input type="number" class="form-control" id="project2-time" min="0">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- 项目三 -->
                            <div class="accordion-item">
                                <h2 class="accordion-header" id="headingProject3">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseProject3" aria-expanded="false" aria-controls="collapseProject3">
                                        项目三成绩
                                    </button>
                                </h2>
                                <div id="collapseProject3" class="accordion-collapse collapse" aria-labelledby="headingProject3" data-bs-parent="#projectGradesAccordion">
                                    <div class="accordion-body">
                                        <div class="row">
                                            <div class="col-md-4">
                                                <div class="mb-3">
                                                    <label for="project3-teacher" class="form-label">教师评分</label>
                                                    <input type="number" class="form-control" id="project3-teacher" min="0" max="100">
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="mb-3">
                                                    <label for="project3-enterprise" class="form-label">企业评分</label>
                                                    <input type="number" class="form-control" id="project3-enterprise" min="0" max="100">
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="mb-3">
                                                    <label for="project3-group" class="form-label">小组评分</label>
                                                    <input type="number" class="form-control" id="project3-group" min="0" max="100">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="mb-3">
                                                    <label for="project3-count" class="form-label">实验次数</label>
                                                    <input type="number" class="form-control" id="project3-count" min="0">
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="mb-3">
                                                    <label for="project3-time" class="form-label">实验完成时间(分钟)</label>
                                                    <input type="number" class="form-control" id="project3-time" min="0">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- 项目四 -->
                            <div class="accordion-item">
                                <h2 class="accordion-header" id="headingProject4">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseProject4" aria-expanded="false" aria-controls="collapseProject4">
                                        项目四成绩
                                    </button>
                                </h2>
                                <div id="collapseProject4" class="accordion-collapse collapse" aria-labelledby="headingProject4" data-bs-parent="#projectGradesAccordion">
                                    <div class="accordion-body">
                                        <div class="row">
                                            <div class="col-md-4">
                                                <div class="mb-3">
                                                    <label for="project4-teacher" class="form-label">教师评分</label>
                                                    <input type="number" class="form-control" id="project4-teacher" min="0" max="100">
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="mb-3">
                                                    <label for="project4-enterprise" class="form-label">企业评分</label>
                                                    <input type="number" class="form-control" id="project4-enterprise" min="0" max="100">
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="mb-3">
                                                    <label for="project4-group" class="form-label">小组评分</label>
                                                    <input type="number" class="form-control" id="project4-group" min="0" max="100">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="mb-3">
                                                    <label for="project4-count" class="form-label">实验次数</label>
                                                    <input type="number" class="form-control" id="project4-count" min="0">
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="mb-3">
                                                    <label for="project4-time" class="form-label">实验完成时间(分钟)</label>
                                                    <input type="number" class="form-control" id="project4-time" min="0">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- 项目五 -->
                            <div class="accordion-item">
                                <h2 class="accordion-header" id="headingProject5">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseProject5" aria-expanded="false" aria-controls="collapseProject5">
                                        项目五成绩
                                    </button>
                                </h2>
                                <div id="collapseProject5" class="accordion-collapse collapse" aria-labelledby="headingProject5" data-bs-parent="#projectGradesAccordion">
                                    <div class="accordion-body">
                                        <div class="row">
                                            <div class="col-md-4">
                                                <div class="mb-3">
                                                    <label for="project5-teacher" class="form-label">教师评分</label>
                                                    <input type="number" class="form-control" id="project5-teacher" min="0" max="100">
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="mb-3">
                                                    <label for="project5-enterprise" class="form-label">企业评分</label>
                                                    <input type="number" class="form-control" id="project5-enterprise" min="0" max="100">
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="mb-3">
                                                    <label for="project5-group" class="form-label">小组评分</label>
                                                    <input type="number" class="form-control" id="project5-group" min="0" max="100">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="mb-3">
                                                    <label for="project5-count" class="form-label">实验次数</label>
                                                    <input type="number" class="form-control" id="project5-count" min="0">
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="mb-3">
                                                    <label for="project5-time" class="form-label">实验完成时间(分钟)</label>
                                                    <input type="number" class="form-control" id="project5-time" min="0">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- 项目六 -->
                            <div class="accordion-item">
                                <h2 class="accordion-header" id="headingProject6">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseProject6" aria-expanded="false" aria-controls="collapseProject6">
                                        项目六成绩
                                    </button>
                                </h2>
                                <div id="collapseProject6" class="accordion-collapse collapse" aria-labelledby="headingProject6" data-bs-parent="#projectGradesAccordion">
                                    <div class="accordion-body">
                                        <div class="row">
                                            <div class="col-md-4">
                                                <div class="mb-3">
                                                    <label for="project6-teacher" class="form-label">教师评分</label>
                                                    <input type="number" class="form-control" id="project6-teacher" min="0" max="100">
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="mb-3">
                                                    <label for="project6-enterprise" class="form-label">企业评分</label>
                                                    <input type="number" class="form-control" id="project6-enterprise" min="0" max="100">
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="mb-3">
                                                    <label for="project6-group" class="form-label">小组评分</label>
                                                    <input type="number" class="form-control" id="project6-group" min="0" max="100">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="mb-3">
                                                    <label for="project6-count" class="form-label">实验次数</label>
                                                    <input type="number" class="form-control" id="project6-count" min="0">
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="mb-3">
                                                    <label for="project6-time" class="form-label">实验完成时间(分钟)</label>
                                                    <input type="number" class="form-control" id="project6-time" min="0">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <h5 class="mt-4 mb-3">单元成绩</h5>
                        <div class="row">
                            <div class="col-md-4">
                                <div class="mb-3">
                                    <label for="unit-basic" class="form-label">遥感基础知识</label>
                                    <input type="number" class="form-control" id="unit-basic" min="0" max="100" required>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="mb-3">
                                    <label for="unit-drone" class="form-label">无人机数据获取遥感</label>
                                    <input type="number" class="form-control" id="unit-drone" min="0" max="100" required>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="mb-3">
                                    <label for="unit-geometric" class="form-label">几何校正</label>
                                    <input type="number" class="form-control" id="unit-geometric" min="0" max="100" required>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-4">
                                <div class="mb-3">
                                    <label for="unit-radiometric" class="form-label">辐射校正</label>
                                    <input type="number" class="form-control" id="unit-radiometric" min="0" max="100" required>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="mb-3">
                                    <label for="unit-registration" class="form-label">图像配准</label>
                                    <input type="number" class="form-control" id="unit-registration" min="0" max="100" required>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="mb-3">
                                    <label for="unit-visual" class="form-label">目视解译</label>
                                    <input type="number" class="form-control" id="unit-visual" min="0" max="100" required>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-4">
                                <div class="mb-3">
                                    <label for="unit-change" class="form-label">变化监测</label>
                                    <input type="number" class="form-control" id="unit-change" min="0" max="100" required>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="mb-3">
                                    <label for="unit-classification" class="form-label">图像分类</label>
                                    <input type="number" class="form-control" id="unit-classification" min="0" max="100" required>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="mb-3">
                                    <label for="unit-accuracy" class="form-label">精度评价</label>
                                    <input type="number" class="form-control" id="unit-accuracy" min="0" max="100" required>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-4">
                                <div class="mb-3">
                                    <label for="unit-mapping" class="form-label">专题制图</label>
                                    <input type="number" class="form-control" id="unit-mapping" min="0" max="100" required>
                                </div>
                            </div>
                        </div>
                        
                        <h5 class="mt-4 mb-3">综合素质评价 (1-5分)</h5>
                        <div class="row">
                            <div class="col-md-3">
                                <div class="mb-3">
                                    <label for="quality-theory" class="form-label">卫星遥感基础理论</label>
                                    <input type="number" class="form-control" id="quality-theory" min="1" max="5" required>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="mb-3">
                                    <label for="quality-drone" class="form-label">无人机遥感知识</label>
                                    <input type="number" class="form-control" id="quality-drone" min="1" max="5" required>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="mb-3">
                                    <label for="quality-software" class="form-label">软件操作技能</label>
                                    <input type="number" class="form-control" id="quality-software" min="1" max="5" required>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="mb-3">
                                    <label for="quality-interpretation" class="form-label">影像解译能力</label>
                                    <input type="number" class="form-control" id="quality-interpretation" min="1" max="5" required>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-3">
                                <div class="mb-3">
                                    <label for="quality-workflow" class="form-label">规范化技术流程</label>
                                    <input type="number" class="form-control" id="quality-workflow" min="1" max="5" required>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="mb-3">
                                    <label for="quality-teamwork" class="form-label">团队协作</label>
                                    <input type="number" class="form-control" id="quality-teamwork" min="1" max="5" required>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="mb-3">
                                    <label for="quality-self-learning" class="form-label">自学能力</label>
                                    <input type="number" class="form-control" id="quality-self-learning" min="1" max="5" required>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="mb-3">
                                    <label for="quality-ethics" class="form-label">职业道德</label>
                                    <input type="number" class="form-control" id="quality-ethics" min="1" max="5" required>
                                </div>
                            </div>
                        </div>
                        
                        <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                            <button type="button" class="btn btn-secondary" id="reset-grade-btn">重置</button>
                            <button type="submit" class="btn btn-primary" id="save-grade-btn">保存成绩</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
}

// 生成成绩查询内容
function generateGradeQueryContent() {
    return `
        <div class="container">
            <h2 class="mb-4">成绩查询</h2>
            
            <div class="card mb-4">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label for="query-class" class="form-label">选择班级</label>
                                <select class="form-select" id="query-class">
                                    <option value="">所有班级</option>
                                    <!-- 班级选项将在这里动态生成 -->
                                </select>
                            </div>
                        </div>
                        <div class="col-md-8">
                            <div class="mb-3">
                                <label for="query-keyword" class="form-label">关键字搜索</label>
                                <div class="input-group">
                                    <input type="text" class="form-control" id="query-keyword" placeholder="输入姓名或学号搜索">
                                    <button class="btn btn-outline-secondary" type="button" id="query-btn">
                                        <i class="bi bi-search"></i> 搜索
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover" id="grade-table">
                            <thead>
                                <tr>
                                    <th>学号</th>
                                    <th>姓名</th>
                                    <th>班级</th>
                                    <th>平时成绩</th>
                                    <th>理论成绩</th>
                                    <th>实践成绩</th>
                                    <th>期末成绩</th>
                                    <th>总评</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody id="grade-list">
                                <!-- 成绩列表将在这里动态生成 -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <!-- 成绩详情模态框 -->
            <div class="modal fade" id="gradeDetailModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">成绩详情</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body" id="grade-detail-content">
                            <!-- 成绩详情将在这里动态生成 -->
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}


// 生成成绩分析内容
function generateGradeAnalysisContent() {
    return `
        <div class="container">
            <h2 class="mb-4">成绩分析</h2>
            
            <div class="card mb-4">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label for="analysis-class" class="form-label">选择班级</label>
                                <select class="form-select" id="analysis-class">
                                    <option value="">请选择班级</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label for="analysis-student" class="form-label">选择学生</label>
                                <select class="form-select" id="analysis-student">
                                    <option value="">请选择学生</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="mb-3">
                                <label for="analysis-type" class="form-label">分析类型</label>
                                <select class="form-select" id="analysis-type">
                                    <option value="individual">个人分析</option>
                                    <option value="class">班级分析</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row charts-row">
                <!-- 雷达图 -->
                <div class="col-md-6">
                    <div class="card mb-4 h-100 chart-card">
                        <div class="card-header bg-light">
                            <div class="d-flex align-items-center">
                                <i class="bi bi-bullseye me-2 text-primary"></i>
                                <span class="fw-bold">综合素质评价</span>
                                <span class="text-muted ms-auto small">八维能力雷达分析</span>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="chart-container" id="radar-chart-container">
                                <canvas id="radar-chart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- 折线图 -->
                <div class="col-md-6">
                    <div class="card mb-4 h-100 chart-card">
                        <div class="card-header bg-light">
                            <div class="d-flex align-items-center">
                                <i class="bi bi-graph-up me-2 text-success"></i>
                                <span class="fw-bold">单元成绩情况</span>
                                <span class="text-muted ms-auto small">10个学习单元成绩</span>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="chart-container" id="line-chart-container">
                                <canvas id="line-chart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- 项目成绩直方图 -->
                <div class="col-md-6">
                    <div class="card mb-4 h-100 chart-card">
                        <div class="card-header bg-light">
                            <div class="d-flex align-items-center">
                                <i class="bi bi-bar-chart-fill me-2 text-warning"></i>
                                <span class="fw-bold">项目成绩组成</span>
                                <span class="text-muted ms-auto small">教师/企业/小组评分构成</span>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="chart-container" id="project-histogram-chart-container">
                                <canvas id="project-histogram-chart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- 项目成绩气泡图 -->
                <div class="col-md-6">
                    <div class="card mb-4 h-100 chart-card">
                        <div class="card-header bg-light">
                            <div class="d-flex align-items-center">
                                <i class="bi bi-diagram-3 me-2 text-danger"></i>
                                <span class="fw-bold">项目实验分析</span>
                                <span class="text-muted ms-auto small">实验次数/时间/成绩关联</span>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="chart-container" id="project-bubble-chart-container">
                                <canvas id="project-bubble-chart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 成绩详情模态框 -->
        <div class="modal fade" id="gradeDetailModal" tabindex="-1" aria-labelledby="gradeDetailModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="gradeDetailModalLabel">成绩详情</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" id="grade-detail-content">
                        <!-- 成绩详情内容将动态加载 -->
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 生成个人信息内容
function generatePersonalInfoContent() {
    return `
        <div class="container">
            <h2 class="mb-4">个人信息</h2>
            
            <div class="card">
                <div class="card-body">
                    <form id="teacher-info-form">
                        <div class="row">
                            <div class="col-md-8">
                                <div class="mb-3">
                                    <label for="teacher-name" class="form-label">姓名</label>
                                    <input type="text" class="form-control" id="teacher-name" value="张教师" required>
                                </div>
                                <div class="mb-3">
                                    <label for="teacher-id" class="form-label">工号</label>
                                    <input type="text" class="form-control" id="teacher-id" value="T20210001" readonly>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">性别</label>
                                    <div>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" name="teacher-gender" id="teacher-male" value="男" checked>
                                            <label class="form-check-label" for="teacher-male">男</label>
                                        </div>
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="radio" name="teacher-gender" id="teacher-female" value="女">
                                            <label class="form-check-label" for="teacher-female">女</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="teacher-phone" class="form-label">联系方式</label>
                                    <input type="text" class="form-control" id="teacher-phone" value="13800138000">
                                </div>
                                <div class="mb-3">
                                    <label for="teacher-email" class="form-label">电子邮箱</label>
                                    <input type="email" class="form-control" id="teacher-email" value="teacher@example.com">
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="mb-3">
                                    <label class="form-label">照片</label>
                                    <div class="text-center">
                                        <img id="teacher-photo-preview" src="placeholder.jpg" alt="教师照片" class="img-fluid mb-2" style="max-height: 200px; border: 1px solid #ddd;">
                                        <input type="file" class="form-control" id="teacher-photo" accept="image/*">
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                            <button type="submit" class="btn btn-primary" id="save-teacher-info-btn">保存信息</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
}

// 生成修改密码内容
function generateChangePasswordContent() {
    return `
        <div class="container">
            <h2 class="mb-4">修改密码</h2>
            
            <div class="card">
                <div class="card-body">
                    <form id="change-password-form">
                        <div class="mb-3">
                            <label for="current-password" class="form-label">当前密码</label>
                            <input type="password" class="form-control" id="current-password" required>
                        </div>
                        <div class="mb-3">
                            <label for="new-password" class="form-label">新密码</label>
                            <input type="password" class="form-control" id="new-password" required>
                        </div>
                        <div class="mb-3">
                            <label for="confirm-password" class="form-label">确认新密码</label>
                            <input type="password" class="form-control" id="confirm-password" required>
                        </div>
                        
                        <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                            <button type="submit" class="btn btn-primary" id="change-password-btn">修改密码</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
}

// 生成系统管理内容
function generateSystemManagementContent() {
    return `
        <div class="container">
            <h2 class="mb-4">系统管理</h2>
            
            <div class="card mb-4">
                <div class="card-header">
                    系统信息
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <p><strong>系统名称：</strong>遥感原理与应用考核评价系统</p>
                            <p><strong>版本号：</strong>1.0.0</p>
                            <p><strong>开发时间：</strong>2025年</p>
                        </div>
                        <div class="col-md-6">
                            <p><strong>浏览器：</strong><span id="browser-info"></span></p>
                            <p><strong>运行环境：</strong><span id="os-info"></span></p>
                            <p><strong>屏幕分辨率：</strong><span id="screen-info"></span></p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="card mb-4">
                <div class="card-header">
                    数据管理
                </div>
                <div class="card-body">
                    <div class="d-grid gap-2 d-md-flex justify-content-md-start">
                        <button type="button" class="btn btn-primary" id="export-data-btn">
                            <i class="bi bi-download"></i> 导出数据
                        </button>
                        <button type="button" class="btn btn-success" id="import-data-btn">
                            <i class="bi bi-upload"></i> 导入数据
                        </button>
                        <button type="button" class="btn btn-danger" id="clear-data-btn">
                            <i class="bi bi-trash"></i> 清空数据
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    系统日志
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-sm" id="log-table">
                            <thead>
                                <tr>
                                    <th>时间</th>
                                    <th>操作</th>
                                    <th>详情</th>
                                </tr>
                            </thead>
                            <tbody id="log-list">
                                <!-- 系统日志将在这里动态生成 -->
                                <tr>
                                    <td>2025-04-08 10:30:45</td>
                                    <td>登录系统</td>
                                    <td>用户 admin 登录系统</td>
                                </tr>
                                <tr>
                                    <td>2025-04-08 10:35:12</td>
                                    <td>添加班级</td>
                                    <td>添加班级 "摄影测量2111"</td>
                                </tr>
                                <tr>
                                    <td>2025-04-08 10:40:28</td>
                                    <td>添加学生</td>
                                    <td>添加学生 "钟阿妹 (2021013225)"</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 仪表盘初始化
function initDashboard() {
    // 更新统计数据
    updateDashboardStats();

    // 绘制班级成绩分布图表
    drawClassScoresChart();

    // 绘制成绩趋势分析图表
    // drawScoreTrendChart();
}

// 更新仪表盘统计数据
function updateDashboardStats() {
    // 获取数据
    const classes = getClasses();
    const students = getStudents();
    const grades = getGrades();

    // 更新数据显示
    document.getElementById('total-classes').textContent = classes.length;
    document.getElementById('total-students').textContent = students.length;
    document.getElementById('total-grades').textContent = grades.length;

    // 计算平均成绩
    let totalScore = 0;
    if (grades.length > 0) {
        grades.forEach(grade => {
            const total = calculateTotalScore(grade);
            totalScore += total;
        });
        document.getElementById('avg-score').textContent = (totalScore / grades.length).toFixed(1);
    } else {
        document.getElementById('avg-score').textContent = "0";
    }
}

// 绘制班级成绩分布图表
function drawClassScoresChart() {
    const ctx = document.getElementById('class-scores-chart').getContext('2d');
    const classes = getClasses();
    const grades = getGrades();

    // 准备数据
    const labels = classes.map(cls => cls.name);
    const data = classes.map(cls => {
        const classGrades = grades.filter(grade => {
            const student = getStudentById(grade.studentId);
            return student && student.class === cls.name;
        });

        if (classGrades.length === 0) return 0;

        let totalScore = 0;
        classGrades.forEach(grade => {
            totalScore += calculateTotalScore(grade);
        });

        return (totalScore / classGrades.length).toFixed(1);
    });

    // 创建图表
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '班级平均成绩',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

// 绘制成绩趋势分析图表
function drawScoreTrendChart() {
    const ctx = document.getElementById('score-trend-chart').getContext('2d');
    const grades = getGrades();

    // 假设有月份数据，这里模拟一些数据
    const months = ['1月', '2月', '3月', '4月', '5月', '6月'];
    const scores = [75, 78, 80, 82, 85, 88]; // 模拟数据

    // 创建图表
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: '平均成绩趋势',
                data: scores,
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
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