// 初始化个人信息页面
function initPersonalInfo() {
    const teacherInfoForm = document.getElementById('teacher-info-form');
    const teacherPhotoInput = document.getElementById('teacher-photo');
    const teacherPhotoPreview = document.getElementById('teacher-photo-preview');

    // 从localStorage获取教师信息
    const teacherInfo = JSON.parse(localStorage.getItem('teacherInfo')) || {
        name: '张教师',
        id: 'T20210001',
        gender: '男',
        phone: '13800138000',
        email: 'teacher@example.com',
        photo: ''
    };

    // 填充表单
    document.getElementById('teacher-name').value = teacherInfo.name || '';
    document.getElementById('teacher-id').value = teacherInfo.id || '';
    if (teacherInfo.gender === '女') {
        document.getElementById('teacher-female').checked = true;
    } else {
        document.getElementById('teacher-male').checked = true;
    }
    document.getElementById('teacher-phone').value = teacherInfo.phone || '';
    document.getElementById('teacher-email').value = teacherInfo.email || '';

    // 显示照片
    if (teacherInfo.photo) {
        teacherPhotoPreview.src = teacherInfo.photo;
    }

    // 照片预览
    teacherPhotoInput.addEventListener('change', function (e) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                teacherPhotoPreview.src = e.target.result;
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    // 保存信息
    teacherInfoForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // 收集表单数据
        const updatedInfo = {
            name: document.getElementById('teacher-name').value,
            id: document.getElementById('teacher-id').value,
            gender: document.querySelector('input[name="teacher-gender"]:checked').value,
            phone: document.getElementById('teacher-phone').value,
            email: document.getElementById('teacher-email').value,
            photo: teacherPhotoPreview.src
        };

        // 保存到localStorage
        localStorage.setItem('teacherInfo', JSON.stringify(updatedInfo));

        alert('个人信息保存成功');
    });
}

// 初始化修改密码页面
function initChangePassword() {
    const changePasswordForm = document.getElementById('change-password-form');
    const currentPasswordInput = document.getElementById('current-password');
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    // 从localStorage获取密码
    const storedPassword = localStorage.getItem('teacherPassword') || 'password123';

    // 表单提交
    changePasswordForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const currentPassword = currentPasswordInput.value;
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // 验证当前密码
        if (currentPassword !== storedPassword) {
            alert('当前密码不正确');
            return;
        }

        // 验证新密码
        if (newPassword.length < 6) {
            alert('新密码长度不能少于6个字符');
            return;
        }

        // 验证确认密码
        if (newPassword !== confirmPassword) {
            alert('新密码与确认密码不一致');
            return;
        }

        // 保存新密码
        localStorage.setItem('teacherPassword', newPassword);

        alert('密码修改成功');

        // 重置表单
        changePasswordForm.reset();
    });
}