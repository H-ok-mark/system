// 数据转换工具 - 从convert.html移植

// 模态框中的数据转换功能
function convertModalData() {
    try {
        // 获取文本内容
        const rawStudentText = document.getElementById('studentData').value;
        const resultElement = document.getElementById('convertResult');

        // 修复JSON格式问题
        const cleanedText = rawStudentText
            .replace(/\/\/.*?\n/g, '')  // 移除注释
            .replace(/,(\s*[\]}])/g, '$1') // 修复尾部逗号
            .replace(/\n\s*,\s*\n/g, ',\n'); // 修复多行格式

        // 解析JSON
        const studentData = JSON.parse(cleanedText);
        resultElement.innerHTML = `<div class="alert alert-info">成功读取 ${studentData.length} 名学生数据，开始转换...</div>`;

        // 调用转换函数
        const importData = generateImportData(studentData);

        // 显示结果
        resultElement.innerHTML += `<div class="alert alert-success">成功生成 ${importData.classes.length} 个班级、${importData.students.length} 名学生的导入数据</div>`;

        // 下载文件
        downloadImportData(importData);
    } catch (error) {
        document.getElementById('convertResult').innerHTML = `<div class="alert alert-danger">错误: ${error.message}</div>`;
    }
}

// 生成导入数据
function generateImportData(students) {
    // 直接从convert.html复制过来的生成导入数据函数
    // ...转换逻辑代码...

    // 提取班级信息
    const classesSet = new Set();
    students.forEach(student => {
        if (student.class) {
            classesSet.add(student.class);
        }
    });

    // 生成班级数据
    const classes = Array.from(classesSet).map((className, index) => {
        // 根据班级名称确定创建时间
        let year = "2020";
        if (className.includes("21")) year = "2021";
        if (className.includes("22")) year = "2022";

        return {
            id: `c${(index + 1).toString().padStart(3, '0')}`,
            name: className,
            createTime: `${year}-09-01`
        };
    });

    // 转换学生数据
    const formattedStudents = students.map(student => ({
        id: student.id,
        name: student.name,
        gender: student.gender,
        class: student.class,
        phone: student.phone,
        photo: ""
    }));

    // 生成成绩数据
    const grades = [];

    // 辅助函数
    function randomScore(min, max) {
        return parseFloat((Math.random() * (max - min) + min).toFixed(1));
    }

    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    // 为每个学生生成成绩
    formattedStudents.forEach(student => {
        const rawStudent = students.find(s => s.id === student.id);

        // 将字符串成绩转为数字
        const usual = parseFloat(rawStudent.usual || 0);
        const practical = parseFloat(rawStudent.practical || 0);
        const final = parseFloat(rawStudent.final || 0);

        // 基准分，用于生成相关的其他分数
        const baseScore = (usual + practical + final) / 3;
        const variationRange = 10;

        // 项目成绩（2-6个项目）
        const projectCount = randomInt(2, 6);
        const projects = {};

        for (let i = 1; i <= projectCount; i++) {
            projects[`project${i}`] = {
                teacher: randomScore(Math.max(60, practical - 10), Math.min(100, practical + 10)),
                enterprise: randomScore(Math.max(60, practical - 10), Math.min(100, practical + 10)),
                group: randomScore(Math.max(60, practical - 10), Math.min(100, practical + 10)),
                experimentCount: randomInt(1, 7),
                experimentTime: randomInt(120, 300)
            };
        }

        // 生成成绩记录
        grades.push({
            studentId: student.id,
            usual: usual,
            practical: practical,
            final: final,
            // 单元成绩和质量评价
            unitBasic: randomScore(Math.max(60, baseScore - variationRange), Math.min(100, baseScore + variationRange)),
            // ...其他单元成绩和质量评价字段...
            projects: projects
        });
    });

    return {
        classes: classes,
        students: formattedStudents,
        grades: grades
    };
}

// 下载导入数据文件
function downloadImportData(data) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "import_data.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    document.getElementById('convertResult').innerHTML += `<div class="alert alert-info">文件已下载，请查看 import_data.json</div>`;
}