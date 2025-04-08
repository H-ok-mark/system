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

// 初始化班级管理页面
function initClassManagement() {
    // 渲染班级列表
    renderClassList();

    // 添加班级按钮点击事件
    document.getElementById('add-class-btn').addEventListener('click', function () {
        // 重置表单
        document.getElementById('class-form').reset();
        document.getElementById('class-id').value = '';
        document.getElementById('classModalTitle').textContent = '添加班级';

        // 显示模态框
        const classModal = new bootstrap.Modal(document.getElementById('classModal'));
        classModal.show();
    });

    // 保存班级按钮点击事件
    document.getElementById('save-class-btn').addEventListener('click', function () {
        // 获取表单数据
        const classId = document.getElementById('class-id').value;
        const className = document.getElementById('class-name').value;

        if (!className) {
            alert('请输入班级名称');
            return;
        }

        if (classId) {
            // 更新班级
            updateClass({
                id: classId,
                name: className
            });
        } else {
            // 添加新班级
            addClass({
                id: 'c' + Date.now(),
                name: className,
                createTime: new Date().toISOString().split('T')[0]
            });
        }

        // 隐藏模态框
        const classModal = bootstrap.Modal.getInstance(document.getElementById('classModal'));
        classModal.hide();

        // 重新渲染班级列表
        renderClassList();
    });
}

// 渲染班级列表
function renderClassList() {
    const classList = document.getElementById('class-list');
    classList.innerHTML = '';

    const classes = getClasses();
    const students = getStudents();

    classes.forEach(cls => {
        // 计算班级学生人数
        const studentCount = students.filter(student => student.class === cls.name).length;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${cls.id}</td>
            <td>${cls.name}</td>
            <td>${studentCount}</td>
            <td>${cls.createTime}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary edit-class-btn" data-id="${cls.id}">
                    <i class="bi bi-pencil"></i> 编辑
                </button>
                <button class="btn btn-sm btn-outline-danger delete-class-btn" data-id="${cls.id}">
                    <i class="bi bi-trash"></i> 删除
                </button>
            </td>
        `;

        classList.appendChild(row);
    });

    // 添加编辑班级按钮点击事件
    document.querySelectorAll('.edit-class-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const classId = this.getAttribute('data-id');
            const classData = getClassById(classId);

            if (classData) {
                // 填充表单数据
                document.getElementById('class-id').value = classData.id;
                document.getElementById('class-name').value = classData.name;
                document.getElementById('classModalTitle').textContent = '编辑班级';

                // 显示模态框
                const classModal = new bootstrap.Modal(document.getElementById('classModal'));
                classModal.show();
            }
        });
    });

    // 添加删除班级按钮点击事件
    document.querySelectorAll('.delete-class-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const classId = this.getAttribute('data-id');
            const classData = getClassById(classId);

            if (confirm(`确定要删除班级 "${classData.name}" 吗？`)) {
                deleteClass(classId);
                renderClassList();
            }
        });
    });
}