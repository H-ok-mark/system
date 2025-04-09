// 初始化存储
function initializeStorage() {
    // 检查是否已有数据，如果没有则初始化
    if (!localStorage.getItem('classes')) {
        localStorage.setItem('classes', JSON.stringify([]));
    }

    if (!localStorage.getItem('students')) {
        localStorage.setItem('students', JSON.stringify([]));
    }

    if (!localStorage.getItem('grades')) {
        localStorage.setItem('grades', JSON.stringify([]));
    }

    // 添加示例数据（如果没有数据）
    const classes = getClasses();
    const students = getStudents();

    if (classes.length === 0) {
        // 添加示例班级
        addClass({
            id: 'c001',
            name: '摄影测量2111',
            createTime: '2022-09-01'
        });
    }

    if (students.length === 0) {
        // 添加示例学生
        addStudent({
            id: '2021013225',
            name: '钟阿妹',
            gender: '女',
            class: '摄影测量2111',
            phone: '13860317804',
            photo: '' // 照片为空
        });
    }
}

// 班级相关操作
function getClasses() {
    return JSON.parse(localStorage.getItem('classes') || '[]');
}

function getClassById(id) {
    const classes = getClasses();
    return classes.find(cls => cls.id === id);
}

function addClass(classData) {
    const classes = getClasses();
    classes.push(classData);
    localStorage.setItem('classes', JSON.stringify(classes));
}

function updateClass(classData) {
    const classes = getClasses();
    const index = classes.findIndex(cls => cls.id === classData.id);

    if (index !== -1) {
        classes[index] = classData;
        localStorage.setItem('classes', JSON.stringify(classes));
        return true;
    }

    return false;
}

function deleteClass(id) {
    let classes = getClasses();
    classes = classes.filter(cls => cls.id !== id);
    localStorage.setItem('classes', JSON.stringify(classes));
}

// 学生相关操作
function getStudents() {
    return JSON.parse(localStorage.getItem('students') || '[]');
}

function getStudentById(id) {
    const students = getStudents();
    return students.find(student => student.id === id);
}

function getStudentsByClass(className) {
    const students = getStudents();
    return students.filter(student => student.class === className);
}

function addStudent(studentData) {
    const students = getStudents();
    students.push(studentData);
    localStorage.setItem('students', JSON.stringify(students));
}

function updateStudent(studentData) {
    const students = getStudents();
    const index = students.findIndex(student => student.id === studentData.id);

    if (index !== -1) {
        students[index] = studentData;
        localStorage.setItem('students', JSON.stringify(students));
        return true;
    }

    return false;
}

function deleteStudent(id) {
    let students = getStudents();
    students = students.filter(student => student.id !== id);
    localStorage.setItem('students', JSON.stringify(students));
}

// 成绩相关操作
function getGrades() {
    return JSON.parse(localStorage.getItem('grades') || '[]');
}

function getGradeByStudentId(studentId) {
    const grades = getGrades();
    return grades.find(grade => grade.studentId === studentId);
}

function addGrade(gradeData) {
    const grades = getGrades();
    // 检查是否已存在该学生的成绩
    const existIndex = grades.findIndex(grade => grade.studentId === gradeData.studentId);

    if (existIndex !== -1) {
        // 更新现有成绩
        grades[existIndex] = gradeData;
    } else {
        // 添加新成绩
        grades.push(gradeData);
    }

    localStorage.setItem('grades', JSON.stringify(grades));
}

function updateGrade(gradeData) {
    const grades = getGrades();
    const index = grades.findIndex(grade => grade.studentId === gradeData.studentId);

    if (index !== -1) {
        grades[index] = gradeData;
        localStorage.setItem('grades', JSON.stringify(grades));
        return true;
    }

    return false;
}

function deleteGrade(studentId) {
    let grades = getGrades();
    grades = grades.filter(grade => grade.studentId !== studentId);
    localStorage.setItem('grades', JSON.stringify(grades));
}

// 导出所有数据
function exportAllData() {
    const data = {
        classes: getClasses(),
        students: getStudents(),
        grades: getGrades()
    };

    return JSON.stringify(data);
}

// 导入所有数据
function importAllData(jsonData) {
    try {
        const data = JSON.parse(jsonData);

        if (data.classes) {
            localStorage.setItem('classes', JSON.stringify(data.classes));
        }

        if (data.students) {
            localStorage.setItem('students', JSON.stringify(data.students));
        }

        if (data.grades) {
            localStorage.setItem('grades', JSON.stringify(data.grades));
        }

        return true;
    } catch (error) {
        console.error('导入数据失败:', error);
        return false;
    }
}

// 清空所有数据
function clearAllData() {
    localStorage.setItem('classes', JSON.stringify([]));
    localStorage.setItem('students', JSON.stringify([]));
    localStorage.setItem('grades', JSON.stringify([]));
}