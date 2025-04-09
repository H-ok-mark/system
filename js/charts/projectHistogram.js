// 项目成绩直方图
function createProjectHistogram(studentId) {
    const grade = getGradeByStudentId(studentId);
    if (!grade || !grade.projects) {
        clearProjectHistogram();
        return;
    }

    // 准备项目成绩数据
    const projectLabels = [];
    const teacherScores = [];
    const enterpriseScores = [];
    const groupScores = [];

    for (let i = 1; i <= 6; i++) {
        const projectKey = `project${i}`;
        projectLabels.push(`项目${i}`);

        if (grade.projects[projectKey]) {
            teacherScores.push(grade.projects[projectKey].teacher || 0);
            enterpriseScores.push(grade.projects[projectKey].enterprise || 0);
            groupScores.push(grade.projects[projectKey].group || 0);
        } else {
            teacherScores.push(0);
            enterpriseScores.push(0);
            groupScores.push(0);
        }
    }

    // 获取Canvas上下文
    const ctx = document.getElementById('project-histogram-chart').getContext('2d');

    // 清除旧图表
    if (window.projectHistogramChart) {
        window.projectHistogramChart.destroy();
    }

    // 创建新图表
    window.projectHistogramChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: projectLabels,
            datasets: [
                {
                    label: '教师评分',
                    data: teacherScores,
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: '企业评分',
                    data: enterpriseScores,
                    backgroundColor: 'rgba(255, 159, 64, 0.7)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 1
                },
                {
                    label: '小组评分',
                    data: groupScores,
                    backgroundColor: 'rgba(75, 192, 192, 0.7)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    max: 100
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: '项目成绩组成',
                    font: {
                        size: 16
                    }
                },
                tooltip: {
                    callbacks: {
                        // 自定义提示信息
                        label: function (context) {
                            const datasetLabel = context.dataset.label || '';
                            const value = context.parsed.y;
                            return `${datasetLabel}: ${value}分`;
                        }
                    }
                }
            }
        }
    });
}

// 班级项目成绩直方图
function createClassProjectHistogram(className) {
    // 获取班级所有学生
    const students = getStudentsByClass(className);
    if (!students || students.length === 0) {
        clearProjectHistogram();
        return;
    }

    // 准备项目成绩平均数据
    const projectLabels = [];
    const avgTeacherScores = [];
    const avgEnterpriseScores = [];
    const avgGroupScores = [];

    // 初始化数据
    for (let i = 1; i <= 6; i++) {
        projectLabels.push(`项目${i}`);
        avgTeacherScores.push(0);
        avgEnterpriseScores.push(0);
        avgGroupScores.push(0);
    }

    // 计算总和
    let validStudentCount = 0;
    students.forEach(student => {
        const grade = getGradeByStudentId(student.id);
        if (grade && grade.projects) {
            validStudentCount++;

            for (let i = 1; i <= 6; i++) {
                const projectKey = `project${i}`;
                if (grade.projects[projectKey]) {
                    avgTeacherScores[i - 1] += grade.projects[projectKey].teacher || 0;
                    avgEnterpriseScores[i - 1] += grade.projects[projectKey].enterprise || 0;
                    avgGroupScores[i - 1] += grade.projects[projectKey].group || 0;
                }
            }
        }
    });

    // 计算平均值
    if (validStudentCount > 0) {
        for (let i = 0; i < 6; i++) {
            avgTeacherScores[i] = avgTeacherScores[i] / validStudentCount;
            avgEnterpriseScores[i] = avgEnterpriseScores[i] / validStudentCount;
            avgGroupScores[i] = avgGroupScores[i] / validStudentCount;
        }
    }

    // 获取Canvas上下文
    const ctx = document.getElementById('project-histogram-chart').getContext('2d');

    // 清除旧图表
    if (window.projectHistogramChart) {
        window.projectHistogramChart.destroy();
    }

    // 创建新图表
    window.projectHistogramChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: projectLabels,
            datasets: [
                {
                    label: '教师评分平均',
                    data: avgTeacherScores,
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: '企业评分平均',
                    data: avgEnterpriseScores,
                    backgroundColor: 'rgba(255, 159, 64, 0.7)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 1
                },
                {
                    label: '小组评分平均',
                    data: avgGroupScores,
                    backgroundColor: 'rgba(75, 192, 192, 0.7)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    max: 100
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: `${className} - 班级项目成绩平均组成`,
                    font: {
                        size: 16
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const datasetLabel = context.dataset.label || '';
                            const value = context.parsed.y.toFixed(1);
                            return `${datasetLabel}: ${value}分`;
                        }
                    }
                }
            }
        }
    });
}

// 清除项目直方图
function clearProjectHistogram() {
    if (window.projectHistogramChart) {
        window.projectHistogramChart.destroy();
        window.projectHistogramChart = null;
    }
}