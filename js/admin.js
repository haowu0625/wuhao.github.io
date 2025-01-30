// 检查登录状态
function checkAuth() {
    const adminUsername = localStorage.getItem('adminUsername');
    if (!adminUsername) {
        window.location.href = 'index.html';
    }
}

// 用户管理功能
const adminPanel = {
    init() {
        checkAuth();
        this.loadUsers();
        this.bindEvents();
    },

    loadUsers() {
        const userList = document.querySelector('.user-list');
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        let html = '<ul>';
        users.forEach(user => {
            if (!user.isAdmin) {
                html += `
                    <li>
                        <span>${user.username}</span>
                        <button data-username="${user.username}" class="delete-btn">删除</button>
                    </li>
                `;
            }
        });
        html += '</ul>';
        userList.innerHTML = html;
    },

    bindEvents() {
        // 退出登录
        document.querySelector('.logout-button').addEventListener('click', () => {
            localStorage.removeItem('adminUsername');
            window.location.href = 'index.html';
        });

        // 添加用户
        const addUserBtn = document.querySelector('.add-user-btn');
        const addUserModal = document.getElementById('addUserModal');
        const addUserForm = addUserModal.querySelector('.add-user-form');

        addUserBtn.addEventListener('click', () => {
            addUserModal.classList.add('active');
        });

        addUserModal.querySelector('.modal-close').addEventListener('click', () => {
            addUserModal.classList.remove('active');
        });

        addUserForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('newUsername').value;
            const password = document.getElementById('newPassword').value;
            
            const users = JSON.parse(localStorage.getItem('users')) || [];
            if (users.some(user => user.username === username)) {
                alert('该用户名已被使用！');
                return;
            }

            users.push({ username, password, isAdmin: false });
            localStorage.setItem('users', JSON.stringify(users));
            alert('用户添加成功！');
            addUserModal.classList.remove('active');
            this.loadUsers();
        });

        // 删除用户
        document.querySelector('.user-list').addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) {
                const username = e.target.dataset.username;
                if (confirm(`确定要删除用户 ${username} 吗？`)) {
                    const users = JSON.parse(localStorage.getItem('users')) || [];
                    const newUsers = users.filter(user => user.username !== username);
                    localStorage.setItem('users', JSON.stringify(newUsers));
                    this.loadUsers();
                }
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    adminPanel.init();
}); 