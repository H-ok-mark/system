// 项目成绩气泡图
function createProjectBubble(studentId) {
    const grade = getGradeByStudentId(studentId);
    if (!grade || !grade.projects) {
        clearProjectBubble();
        return;
    }

    // 准备项目成绩数据
    const bubbleData = [];

    for (let i = 1; i <= 6; i++) {
        const projectKey = `project${i}`;

        if (grade.projects[projectKey]) {
            const teacher = grade.projects[projectKey].teacher || 0;
            const enterprise = grade.projects[projectKey].enterprise || 0;
            const group = grade.projects[projectKey].group || 0;

            // 计算总分 
            const total = teacher + enterprise + group;

            // 添加数据点 (x为项目编号，y为总分，r为总分/4作为气泡大小)
            bubbleData.push({
                x: i,
                y: total,
                r: Math.max(5, total / 4), // 至少5的大小，避免气泡太小
                teacherScore: teacher,
                enterpriseScore: enterprise,
                groupScore: group,
                gradeLevel: getGradeLevel(total) // 添加成绩等级
            });
        } else {
            // 如果没有数据，放一个小气泡占位
            bubbleData.push({
                x: i,
                y: 0,
                r: 5,
                teacherScore: 0,
                enterpriseScore: 0,
                groupScore: 0,
                gradeLevel: '未录入'
            });
        }
    }

    // 获取Canvas上下文
    const ctx = document.getElementById('project-bubble-chart').getContext('2d');

    // 清除旧图表
    if (window.projectBubbleChart) {
        window.projectBubbleChart.destroy();
    }

    // 准备颜色映射数据
    const bgColorMap = {
        '优秀': 'rgba(75, 192, 192, 0.7)',  // 绿色
        '良好': 'rgba(54, 162, 235, 0.7)',  // 蓝色
        '中等': 'rgba(255, 205, 86, 0.7)',  // 黄色
        '及格': 'rgba(255, 159, 64, 0.7)',  // 橙色
        '不及格': 'rgba(255, 99, 132, 0.7)', // 红色
        '未录入': 'rgba(200, 200, 200, 0.5)' // 灰色
    };

    const borderColorMap = {
        '优秀': 'rgba(75, 192, 192, 1)',
        '良好': 'rgba(54, 162, 235, 1)',
        '中等': 'rgba(255, 205, 86, 1)',
        '及格': 'rgba(255, 159, 64, 1)',
        '不及格': 'rgba(255, 99, 132, 1)',
        '未录入': 'rgba(200, 200, 200, 1)'
    };

    // 创建新图表
    window.projectBubbleChart = new Chart(ctx, {
        type: 'bubble',
        data: {
            datasets: [{
                label: '项目成绩',
                data: bubbleData,
                backgroundColor: function (context) {
                    const gradeLevel = context.raw.gradeLevel;
                    return bgColorMap[gradeLevel];
                },
                borderColor: function (context) {
                    const gradeLevel = context.raw.gradeLevel;
                    return borderColorMap[gradeLevel];
                },
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    min: 0,
                    max: 7,
                    title: {
                        display: true,
                        text: '项目编号'
                    },
                    ticks: {
                        callback: function (value) {
                            if (value >= 1 && value <= 6) {
                                return '项目' + value;
                            }
                            return '';
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: '总评分'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: '项目成绩',
                    font: {
                        size: 16
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const data = context.raw;
                            return [
                                `项目${data.x} - 总分: ${data.y.toFixed(1)} (${data.gradeLevel})`,
                                `教师评分: ${data.teacherScore}`,
                                `企业评分: ${data.enterpriseScore}`,
                                `小组评分: ${data.groupScore}`
                            ];
                        }
                    }
                },
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        generateLabels: function () {
                            return [
                                { text: '优秀 (90-100分)', fillStyle: bgColorMap['优秀'], strokeStyle: borderColorMap['优秀'] },
                                { text: '良好 (80-89分)', fillStyle: bgColorMap['良好'], strokeStyle: borderColorMap['良好'] },
                                { text: '中等 (70-79分)', fillStyle: bgColorMap['中等'], strokeStyle: borderColorMap['中等'] },
                                { text: '及格 (60-69分)', fillStyle: bgColorMap['及格'], strokeStyle: borderColorMap['及格'] },
                                { text: '不及格 (<60分)', fillStyle: bgColorMap['不及格'], strokeStyle: borderColorMap['不及格'] }
                            ];
                        }
                    }
                }
            }
        }
    });

    // 存储背景色和边框色映射，供模态框放大使用
    window.projectBubbleChart.bgColorMap = bgColorMap;
    window.projectBubbleChart.borderColorMap = borderColorMap;
}

// 班级项目成绩气泡图
function createClassProjectBubble(className) {
    // 获取班级所有学生
    const students = getStudentsByClass(className);
    if (!students || students.length === 0) {
        clearProjectBubble();
        return;
    }

    // 准备各项目的平均成绩数据
    const bubbleData = [];
    const projectTotals = Array(6).fill(0);
    const projectCounts = Array(6).fill(0);
    const teacherScores = Array(6).fill(0);
    const enterpriseScores = Array(6).fill(0);
    const groupScores = Array(6).fill(0);

    // 计算每个项目的成绩总和
    students.forEach(student => {
        const grade = getGradeByStudentId(student.id);
        if (grade && grade.projects) {
            for (let i = 1; i <= 6; i++) {
                const projectKey = `project${i}`;
                if (grade.projects[projectKey]) {
                    const teacher = grade.projects[projectKey].teacher || 0;
                    const enterprise = grade.projects[projectKey].enterprise || 0;
                    const group = grade.projects[projectKey].group || 0;

                    // 累加成绩
                    teacherScores[i - 1] += teacher;
                    enterpriseScores[i - 1] += enterprise;
                    groupScores[i - 1] += group;

                    // 计算该学生这个项目的总分
                    const total = teacher + enterprise + group;
                    projectTotals[i - 1] += total;
                    projectCounts[i - 1]++;
                }
            }
        }
    });

    // 计算平均成绩并生成气泡数据
    for (let i = 0; i < 6; i++) {
        if (projectCounts[i] > 0) {
            const avgTotal = projectTotals[i] / projectCounts[i];
            const avgTeacher = teacherScores[i] / projectCounts[i];
            const avgEnterprise = enterpriseScores[i] / projectCounts[i];
            const avgGroup = groupScores[i] / projectCounts[i];

            bubbleData.push({
                x: i + 1,
                y: avgTotal,
                r: Math.max(5, avgTotal / 4), // 气泡大小基于平均分
                teacherScore: avgTeacher,
                enterpriseScore: avgEnterprise,
                groupScore: avgGroup,
                studentCount: projectCounts[i],
                gradeLevel: getGradeLevel(avgTotal) // 添加成绩等级
            });
        } else {
            // 没有数据的项目放一个小气泡占位
            bubbleData.push({
                x: i + 1,
                y: 0,
                r: 5,
                teacherScore: 0,
                enterpriseScore: 0,
                groupScore: 0,
                studentCount: 0,
                gradeLevel: '未录入'
            });
        }
    }

    // 获取Canvas上下文
    const ctx = document.getElementById('project-bubble-chart').getContext('2d');

    // 清除旧图表
    if (window.projectBubbleChart) {
        window.projectBubbleChart.destroy();
    }

    // 准备颜色映射数据
    const bgColorMap = {
        '优秀': 'rgba(75, 192, 192, 0.7)',  // 绿色
        '良好': 'rgba(54, 162, 235, 0.7)',  // 蓝色
        '中等': 'rgba(255, 205, 86, 0.7)',  // 黄色
        '及格': 'rgba(255, 159, 64, 0.7)',  // 橙色
        '不及格': 'rgba(255, 99, 132, 0.7)', // 红色
        '未录入': 'rgba(200, 200, 200, 0.5)' // 灰色
    };

    const borderColorMap = {
        '优秀': 'rgba(75, 192, 192, 1)',
        '良好': 'rgba(54, 162, 235, 1)',
        '中等': 'rgba(255, 205, 86, 1)',
        '及格': 'rgba(255, 159, 64, 1)',
        '不及格': 'rgba(255, 99, 132, 1)',
        '未录入': 'rgba(200, 200, 200, 1)'
    };

    // 创建新图表
    window.projectBubbleChart = new Chart(ctx, {
        type: 'bubble',
        data: {
            datasets: [{
                label: '班级项目平均成绩',
                data: bubbleData,
                backgroundColor: function (context) {
                    const gradeLevel = context.raw.gradeLevel;
                    return bgColorMap[gradeLevel];
                },
                borderColor: function (context) {
                    const gradeLevel = context.raw.gradeLevel;
                    return borderColorMap[gradeLevel];
                },
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    min: 0,
                    max: 7,
                    title: {
                        display: true,
                        text: '项目编号'
                    },
                    ticks: {
                        callback: function (value) {
                            if (value >= 1 && value <= 6) {
                                return '项目' + value;
                            }
                            return '';
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: '平均分'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: `${className} - 班级项目评价成绩`,
                    font: {
                        size: 16
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const data = context.raw;
                            return [
                                `项目${data.x} - 平均分: ${data.y.toFixed(1)} (${data.gradeLevel})`,
                                `学生数量: ${data.studentCount}`,
                                `教师评分平均: ${data.teacherScore.toFixed(1)}`,
                                `企业评分平均: ${data.enterpriseScore.toFixed(1)}`,
                                `小组评分平均: ${data.groupScore.toFixed(1)}`
                            ];
                        }
                    }
                },
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        generateLabels: function () {
                            return [
                                { text: '优秀 (90-100分)', fillStyle: bgColorMap['优秀'], strokeStyle: borderColorMap['优秀'] },
                                { text: '良好 (80-89分)', fillStyle: bgColorMap['良好'], strokeStyle: borderColorMap['良好'] },
                                { text: '中等 (70-79分)', fillStyle: bgColorMap['中等'], strokeStyle: borderColorMap['中等'] },
                                { text: '及格 (60-69分)', fillStyle: bgColorMap['及格'], strokeStyle: borderColorMap['及格'] },
                                { text: '不及格 (<60分)', fillStyle: bgColorMap['不及格'], strokeStyle: borderColorMap['不及格'] }
                            ];
                        }
                    }
                }
            }
        }
    });

    // 存储背景色和边框色映射，供模态框放大使用
    window.projectBubbleChart.bgColorMap = bgColorMap;
    window.projectBubbleChart.borderColorMap = borderColorMap;
}

// 清除项目气泡图
function clearProjectBubble() {
    if (window.projectBubbleChart) {
        window.projectBubbleChart.destroy();
        window.projectBubbleChart = null;
    }
}

// 根据分数获取成绩等级
function getGradeLevel(score) {
    if (score >= 90) return '优秀';
    else if (score >= 80) return '良好';
    else if (score >= 70) return '中等';
    else if (score >= 60) return '及格';
    else if (score > 0) return '不及格';
    else return '未录入';
}