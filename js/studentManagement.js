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
                                            <img id="student-photo-preview" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50' y='50' font-size='20' text-anchor='middle' alignment-baseline='middle' font-family='Arial, sans-serif' fill='%23999999'%3E照片%3C/text%3E%3C/svg%3E" alt="学生照片" class="img-fluid mb-2" style="max-height: 200px; border: 1px solid #ddd;">
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

// 初始化学生信息页面
function initStudentInfo() {
    // 填充班级选择框
    fillClassSelect();

    // 渲染学生列表
    renderStudentList();

    // 添加学生按钮点击事件
    document.getElementById('add-student-btn').addEventListener('click', function () {
        // 重置表单
        document.getElementById('student-form').reset();
        document.getElementById('student-photo-preview').src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50' y='50' font-size='20' text-anchor='middle' alignment-baseline='middle' font-family='Arial, sans-serif' fill='%23999999'%3E照片%3C/text%3E%3C/svg%3E";
        document.getElementById('studentModalTitle').textContent = '添加学生';

        // 填充班级选择框
        fillStudentModalClassSelect();

        // 显示模态框
        const studentModal = new bootstrap.Modal(document.getElementById('studentModal'));
        studentModal.show();
    });

    // 保存学生按钮点击事件
    document.getElementById('save-student-btn').addEventListener('click', function () {
        // 获取表单数据
        const studentId = document.getElementById('student-id').value;
        const studentName = document.getElementById('student-name').value;
        const studentGender = document.querySelector('input[name="student-gender"]:checked').value;
        const studentClass = document.getElementById('student-class').value;
        const studentPhone = document.getElementById('student-phone').value;

        if (!studentId || !studentName || !studentClass) {
            alert('请填写必填字段');
            return;
        }

        // 获取照片数据
        const photoFile = document.getElementById('student-photo').files[0];
        let photoData = '';

        const saveStudentData = function () {
            // 创建学生数据对象
            const studentData = {
                id: studentId,
                name: studentName,
                gender: studentGender,
                class: studentClass,
                phone: studentPhone,
                photo: photoData
            };

            // 检查学生是否已存在
            const existingStudent = getStudentById(studentId);
            if (existingStudent && document.getElementById('studentModalTitle').textContent === '添加学生') {
                alert('该学号已存在');
                return;
            }

            // 添加或更新学生
            if (existingStudent) {
                updateStudent(studentData);
            } else {
                addStudent(studentData);
            }

            // 隐藏模态框
            const studentModal = bootstrap.Modal.getInstance(document.getElementById('studentModal'));
            studentModal.hide();

            // 重新渲染学生列表
            renderStudentList();
        };

        if (photoFile) {
            // 读取照片文件为Base64
            const reader = new FileReader();
            reader.onload = function (e) {
                photoData = e.target.result;
                saveStudentData();
            };
            reader.readAsDataURL(photoFile);
        } else {
            // 如果是编辑，保留原来的照片
            const existingStudent = getStudentById(studentId);
            if (existingStudent) {
                photoData = existingStudent.photo;
            }
            saveStudentData();
        }
    });

    // 照片预览
    document.getElementById('student-photo').addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById('student-photo-preview').src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // 班级筛选变化事件
    document.getElementById('search-class').addEventListener('change', function () {
        renderStudentList();
    });

    // 搜索按钮点击事件
    document.getElementById('search-btn').addEventListener('click', function () {
        renderStudentList();
    });
}

// 填充班级选择框
function fillClassSelect() {
    const classSelect = document.getElementById('search-class');
    classSelect.innerHTML = '<option value="">所有班级</option>';

    const classes = getClasses();
    classes.forEach(cls => {
        const option = document.createElement('option');
        option.value = cls.name;
        option.textContent = cls.name;
        classSelect.appendChild(option);
    });
}

// 填充学生模态框中的班级选择框
function fillStudentModalClassSelect() {
    const classSelect = document.getElementById('student-class');
    classSelect.innerHTML = '';

    const classes = getClasses();
    classes.forEach(cls => {
        const option = document.createElement('option');
        option.value = cls.name;
        option.textContent = cls.name;
        classSelect.appendChild(option);
    });

    // 默认选中第一个选项
    if (classes.length > 0) {
        classSelect.value = classes[0].name;
    }
}

// 渲染学生列表
function renderStudentList() {
    const studentList = document.getElementById('student-list');
    studentList.innerHTML = '';

    // 获取筛选条件
    const filterClass = document.getElementById('search-class').value;
    const keyword = document.getElementById('search-keyword').value.toLowerCase();

    let students = getStudents();

    // 应用班级筛选
    if (filterClass) {
        students = students.filter(student => student.class === filterClass);
    }

    // 应用关键字搜索
    if (keyword) {
        students = students.filter(student =>
            student.name.toLowerCase().includes(keyword) ||
            student.id.toLowerCase().includes(keyword)
        );
    }

    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.gender}</td>
            <td>${student.class}</td>
            <td>${student.phone || '-'}</td>
            <td>
                <button class="btn btn-sm btn-outline-info view-student-btn" data-id="${student.id}">
                    <i class="bi bi-eye"></i> 查看
                </button>
                <button class="btn btn-sm btn-outline-primary edit-student-btn" data-id="${student.id}">
                    <i class="bi bi-pencil"></i> 编辑
                </button>
                <button class="btn btn-sm btn-outline-danger delete-student-btn" data-id="${student.id}">
                    <i class="bi bi-trash"></i> 删除
                </button>
            </td>
        `;

        studentList.appendChild(row);
    });

    // 添加查看学生按钮点击事件
    document.querySelectorAll('.view-student-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const studentId = this.getAttribute('data-id');
            viewStudentDetails(studentId);
        });
    });

    // 添加编辑学生按钮点击事件
    document.querySelectorAll('.edit-student-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const studentId = this.getAttribute('data-id');
            editStudent(studentId);
        });
    });

    // 添加删除学生按钮点击事件
    document.querySelectorAll('.delete-student-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const studentId = this.getAttribute('data-id');
            const student = getStudentById(studentId);

            if (confirm(`确定要删除学生 "${student.name}" 吗？`)) {
                deleteStudent(studentId);
                renderStudentList();
            }
        });
    });
}

// 查看学生详情
function viewStudentDetails(studentId) {
    const student = getStudentById(studentId);

    if (student) {
        // 这里可以实现查看学生详情的功能
        alert(`学生详情：\n姓名：${student.name}\n学号：${student.id}\n性别：${student.gender}\n班级：${student.class}\n联系方式：${student.phone || '无'}`);
    }
}

// 编辑学生
function editStudent(studentId) {
    const student = getStudentById(studentId);

    if (student) {
        // 填充表单数据
        document.getElementById('student-id').value = student.id;
        document.getElementById('student-id').readOnly = true; // 学号不允许修改
        document.getElementById('student-name').value = student.name;

        if (student.gender === '男') {
            document.getElementById('gender-male').checked = true;
        } else {
            document.getElementById('gender-female').checked = true;
        }

        fillStudentModalClassSelect();
        document.getElementById('student-class').value = student.class;
        document.getElementById('student-phone').value = student.phone || '';

        if (student.photo) {
            document.getElementById('student-photo-preview').src = student.photo;
        } else {
            document.getElementById('student-photo-preview').src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50' y='50' font-size='20' text-anchor='middle' alignment-baseline='middle' font-family='Arial, sans-serif' fill='%23999999'%3E照片%3C/text%3E%3C/svg%3E";
        }

        document.getElementById('studentModalTitle').textContent = '编辑学生';

        // 显示模态框
        const studentModal = new bootstrap.Modal(document.getElementById('studentModal'));
        studentModal.show();
    }
}