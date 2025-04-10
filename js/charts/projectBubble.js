// 项目成绩气泡图 - 修改版
function createProjectBubble(studentId) {
    const grade = getGradeByStudentId(studentId);
    if (!grade || !grade.projects) {
        clearProjectBubble();
        return;
    }

    // 准备项目成绩数据
    const bubbleData = [];
    const colors = [
        'rgba(255, 99, 132, 0.7)',   // 红色 - 项目1
        'rgba(54, 162, 235, 0.7)',   // 蓝色 - 项目2
        'rgba(255, 206, 86, 0.7)',   // 黄色 - 项目3
        'rgba(75, 192, 192, 0.7)',   // 绿色 - 项目4
        'rgba(153, 102, 255, 0.7)',  // 紫色 - 项目5
        'rgba(255, 159, 64, 0.7)'    // 橙色 - 项目6
    ];

    const borderColors = [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
    ];

    for (let i = 1; i <= 6; i++) {
        const projectKey = `project${i}`;

        if (grade.projects[projectKey]) {
            const project = grade.projects[projectKey];
            const teacher = project.teacher || 0;
            const enterprise = project.enterprise || 0;
            const group = project.group || 0;
            const experimentCount = project.experimentCount || 0;
            const experimentTime = project.experimentTime || 0;

            // 计算总分 
            const total = (teacher * 0.4) + (enterprise * 0.4) + (group * 0.2);

            // 添加数据点
            // 横坐标为实验完成时间，纵坐标为实验次数，气泡大小为总分/3
            if (experimentTime > 0 || experimentCount > 0 || total > 0) {
                bubbleData.push({
                    x: experimentTime,
                    y: experimentCount,
                    r: Math.max(5, total / 3), // 至少5的大小，避免气泡太小
                    projectNumber: i,
                    projectName: `项目${i}`,
                    teacherScore: teacher,
                    enterpriseScore: enterprise,
                    groupScore: group,
                    total: total,
                    gradeLevel: getGradeLevel(total) // 添加成绩等级
                });
            }
        }
    }

    // 获取Canvas上下文
    const ctx = document.getElementById('project-bubble-chart').getContext('2d');

    // 清除旧图表
    if (window.projectBubbleChart) {
        window.projectBubbleChart.destroy();
    }

    // 准备数据集
    const datasets = [];

    // 每个项目使用单独的数据集，便于独立应用颜色
    for (let i = 1; i <= 6; i++) {
        const projectData = bubbleData.filter(item => item.projectNumber === i);

        if (projectData.length > 0) {
            datasets.push({
                label: `项目${i}`,
                data: projectData,
                backgroundColor: colors[i - 1],
                borderColor: borderColors[i - 1],
                borderWidth: 1
            });
        }
    }

    // 如果没有有效数据，显示空图表
    if (datasets.length === 0) {
        datasets.push({
            label: '暂无数据',
            data: [{ x: 100, y: 0, r: 5 }],
            backgroundColor: 'rgba(200, 200, 200, 0.3)',
            borderColor: 'rgba(200, 200, 200, 0.5)',
            borderWidth: 1
        });
    }

    // 创建新图表
    window.projectBubbleChart = new Chart(ctx, {
        type: 'bubble',
        data: {
            datasets: datasets
        },
        options: {
            ...chartBaseOptions, // 继承全局配置
            responsive: true,
            layout: {
                // padding: {
                //     top: 10 // 消除顶部padding
                // }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        // text: '实验完成时间 (分钟)'
                    },
                    min: 100,
                    max: 320,
                    ticks: {
                        stepSize: 20
                    }
                },
                y: {
                    beginAtZero: true,
                    min: 0,
                    max: 8,
                    ticks: {
                        stepSize: 1
                    },
                    title: {
                        display: true,
                        // text: '实验次数'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: '项目实验分析',
                    font: {
                        size: 16
                    },
                    padding: {
                        top: 10,
                        bottom: 10
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const data = context.raw;
                            if (!data.projectName) return '暂无数据';

                            return [
                                `${data.projectName}`,
                                `总分: ${data.total.toFixed(1)} (${data.gradeLevel})`,
                                `实验次数: ${data.y}次`,
                                `完成时间: ${data.x}分钟`,
                                `教师评分: ${data.teacherScore}`,
                                `企业评分: ${data.enterpriseScore}`,
                                `小组评分: ${data.groupScore}`
                            ];
                        }
                    }
                },
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        boxWidth: 12,      // 减小图例颜色框宽度
                        boxHeight: 12,     // 减小图例颜色框高度
                        padding: 8,        // 减小图例项之间的间距
                        font: {
                            size: 11       // 减小图例文字大小
                        }
                    },
                    maxHeight: 40,         // 限制图例最大高度
                    maxWidth: 400          // 限制图例最大宽度
                }
            }
        }
    });

    // 存储颜色数据以供模态框使用
    window.projectBubbleChart.chartColors = colors;
    window.projectBubbleChart.chartBorderColors = borderColors;
}

// 班级项目成绩气泡图 (班级分析)
function createClassProjectBubble(className) {
    // 获取班级所有学生
    const students = getStudentsByClass(className);
    if (!students || students.length === 0) {
        clearProjectBubble();
        return;
    }

    // 准备各项目的平均数据
    const projectData = Array(6).fill().map(() => ({
        experimentTime: 0,
        experimentCount: 0,
        total: 0,
        teacherScore: 0,
        enterpriseScore: 0,
        groupScore: 0,
        count: 0
    }));

    // 计算每个项目的数据
    students.forEach(student => {
        const grade = getGradeByStudentId(student.id);
        if (grade && grade.projects) {
            for (let i = 1; i <= 6; i++) {
                const projectKey = `project${i}`;
                if (grade.projects[projectKey]) {
                    const project = grade.projects[projectKey];
                    const teacher = project.teacher || 0;
                    const enterprise = project.enterprise || 0;
                    const group = project.group || 0;
                    const experimentTime = project.experimentTime || 0;
                    const experimentCount = project.experimentCount || 0;

                    if (teacher > 0 || enterprise > 0 || group > 0 || experimentTime > 0 || experimentCount > 0) {
                        projectData[i - 1].experimentTime += experimentTime;
                        projectData[i - 1].experimentCount += experimentCount;
                        projectData[i - 1].teacherScore += teacher;
                        projectData[i - 1].enterpriseScore += enterprise;
                        projectData[i - 1].groupScore += group;
                        projectData[i - 1].total += (teacher * 0.4) + (enterprise * 0.4) + (group * 0.2);
                        projectData[i - 1].count++;
                    }
                }
            }
        }
    });

    // 准备气泡数据
    const bubbleData = [];
    const colors = [
        'rgba(255, 99, 132, 0.7)',   // 红色 - 项目1
        'rgba(54, 162, 235, 0.7)',   // 蓝色 - 项目2
        'rgba(255, 206, 86, 0.7)',   // 黄色 - 项目3
        'rgba(75, 192, 192, 0.7)',   // 绿色 - 项目4
        'rgba(153, 102, 255, 0.7)',  // 紫色 - 项目5
        'rgba(255, 159, 64, 0.7)'    // 橙色 - 项目6
    ];

    const borderColors = [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
    ];

    // 构建每个项目的数据集
    const datasets = [];

    for (let i = 0; i < 6; i++) {
        if (projectData[i].count > 0) {
            // 计算平均值
            const avgTime = projectData[i].experimentTime / projectData[i].count;
            const avgCount = projectData[i].experimentCount / projectData[i].count;
            const avgTotal = projectData[i].total / projectData[i].count;
            const avgTeacher = projectData[i].teacherScore / projectData[i].count;
            const avgEnterprise = projectData[i].enterpriseScore / projectData[i].count;
            const avgGroup = projectData[i].groupScore / projectData[i].count;

            // 添加项目数据
            const projectDataPoint = {
                x: avgTime,
                y: avgCount,
                r: Math.max(5, avgTotal / 3),
                projectNumber: i + 1,
                projectName: `项目${i + 1}`,
                total: avgTotal,
                teacherScore: avgTeacher,
                enterpriseScore: avgEnterprise,
                groupScore: avgGroup,
                studentCount: projectData[i].count,
                gradeLevel: getGradeLevel(avgTotal)
            };

            // 为每个项目创建独立数据集
            datasets.push({
                label: `项目${i + 1}`,
                data: [projectDataPoint],
                backgroundColor: colors[i],
                borderColor: borderColors[i],
                borderWidth: 1
            });
        }
    }

    // 如果没有有效数据，显示空图表
    if (datasets.length === 0) {
        datasets.push({
            label: '暂无数据',
            data: [{ x: 100, y: 0, r: 5 }],
            backgroundColor: 'rgba(200, 200, 200, 0.3)',
            borderColor: 'rgba(200, 200, 200, 0.5)',
            borderWidth: 1
        });
    }

    // 获取Canvas上下文
    const ctx = document.getElementById('project-bubble-chart').getContext('2d');

    // 清除旧图表
    if (window.projectBubbleChart) {
        window.projectBubbleChart.destroy();
    }

    // 创建新图表
    window.projectBubbleChart = new Chart(ctx, {
        type: 'bubble',
        data: {
            datasets: datasets
        },
        options: {
            ...chartBaseOptions, // 继承全局配置
            responsive: true,
            layout: {
                // padding: {
                //     top: 10 // 消除顶部padding
                // }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        // text: '平均实验完成时间 (分钟)'
                    },
                    min: 100,
                    max: 320,
                    ticks: {
                        stepSize: 20
                    }
                },
                y: {
                    beginAtZero: true,
                    min: 0,
                    max: 8,
                    ticks: {
                        stepSize: 1
                    },
                    title: {
                        display: true,
                        // text: '平均实验次数'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: `${className} - 班级项目实验分析`,
                    font: {
                        size: 16
                    },
                    padding: {
                        top: 0, // 减少标题顶部padding
                        bottom: 10
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const data = context.raw;
                            if (!data.projectName) return '暂无数据';

                            return [
                                `${data.projectName}`,
                                `学生数量: ${data.studentCount}人`,
                                `平均总分: ${data.total.toFixed(1)} (${data.gradeLevel})`,
                                `平均实验次数: ${data.y.toFixed(1)}次`,
                                `平均完成时间: ${data.x.toFixed(1)}分钟`,
                                `平均教师评分: ${data.teacherScore.toFixed(1)}`,
                                `平均企业评分: ${data.enterpriseScore.toFixed(1)}`,
                                `平均小组评分: ${data.groupScore.toFixed(1)}`
                            ];
                        }
                    }
                },
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        boxWidth: 12,      // 减小图例颜色框宽度
                        boxHeight: 12,     // 减小图例颜色框高度
                        padding: 8,        // 减小图例项之间的间距
                        font: {
                            size: 11       // 减小图例文字大小
                        }
                    },
                    maxHeight: 40,         // 限制图例最大高度
                    maxWidth: 400          // 限制图例最大宽度
                }
            }
        }
    });

    // 存储颜色数据以供模态框使用
    window.projectBubbleChart.chartColors = colors;
    window.projectBubbleChart.chartBorderColors = borderColors;
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