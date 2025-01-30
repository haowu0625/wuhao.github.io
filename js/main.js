// 管理员账号信息
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123',
    isAdmin: true
};

// 用户数据存储
const users = new Map();
users.set(ADMIN_CREDENTIALS.username, ADMIN_CREDENTIALS);

// Modal Handling
const modal = {
    init() {
        const authButton = document.querySelector('.auth-button');
        const modal = document.querySelector('#loginModal');
        const closeBtn = modal.querySelector('.modal-close');
        const loginForm = modal.querySelector('.login-form');

        authButton.addEventListener('click', () => this.open());
        closeBtn.addEventListener('click', () => this.close());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.close();
        });

        // 修改表单提交事件的绑定方式
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // 添加表单输入事件监听
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        
        emailInput.addEventListener('input', () => {
            console.log('Email input:', emailInput.value);
        });
        
        passwordInput.addEventListener('input', () => {
            console.log('Password input:', passwordInput.value);
        });
    },

    handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const user = users.get(username);

        if (user && user.password === password) {
            if (user.isAdmin) {
                // 存储管理员登录状态
                localStorage.setItem('adminUsername', username);
                // 重定向到管理员页面
                window.location.href = 'admin.html';
            } else {
                alert('登录成功！');
                this.close();
            }
        } else {
            alert('用户名或密码错误！');
        }
    },

    showAdminPanel() {
        // 确保只有管理员可以访问
        const email = document.getElementById('email').value;
        const user = users.get(email);
        if (!user || !user.isAdmin) {
            alert('无权限访问管理员面板');
            return;
        }

        // 先移除已存在的管理员面板（如果有）
        const existingPanel = document.querySelector('.admin-panel');
        if (existingPanel) {
            existingPanel.remove();
        }

        // 创建管理员面板
        const adminPanel = document.createElement('div');
        adminPanel.className = 'admin-panel';
        adminPanel.innerHTML = `
            <h2>管理员面板</h2>
            <div class="user-management">
                <h3>用户管理</h3>
                <div class="user-list">
                    ${this.generateUserList()}
                </div>
                <button type="button" class="add-user-btn">添加用户</button>
            </div>
        `;

        // 添加到 DOM
        document.body.appendChild(adminPanel);

        // 使用事件委托绑定所有按钮事件
        adminPanel.addEventListener('click', (e) => {
            // 添加用户按钮
            if (e.target.classList.contains('add-user-btn')) {
                console.log('添加用户按钮被点击');
                this.showAddUserForm();
            }
            
            // 删除用户按钮
            if (e.target.classList.contains('delete-btn')) {
                const email = e.target.dataset.email;
                this.deleteUser(email);
            }
        });
    },

    generateUserList() {
        let html = '<ul>';
        users.forEach((user, email) => {
            if (!user.isAdmin) {
                html += `
                    <li>
                        <span>${email}</span>
                        <button data-email="${email}" class="delete-btn">删除</button>
                    </li>
                `;
            }
        });
        html += '</ul>';
        return html;
    },

    showAddUserForm() {
        console.log('开始执行 showAddUserForm');
        
        // 先移除已存在的添加用户表单
        const existingForm = document.querySelector('.add-user-form');
        if (existingForm) {
            existingForm.remove();
        }

        // 创建表单
        const form = document.createElement('div');
        form.className = 'add-user-form modal';
        form.style.display = 'flex';
        form.innerHTML = `
            <div class="modal-content">
                <button type="button" class="modal-close" aria-label="关闭">×</button>
                <h3>添加新用户</h3>
                <form class="add-user-form-inner">
                    <div class="form-group">
                        <input type="email" id="newEmail" placeholder=" " required>
                        <label for="newEmail">邮箱</label>
                    </div>
                    <div class="form-group">
                        <input type="password" id="newPassword" placeholder=" " required>
                        <label for="newPassword">密码</label>
                    </div>
                    <button type="submit" class="submit-btn">添加</button>
                </form>
            </div>
        `;

        // 添加到 DOM
        document.body.appendChild(form);
        console.log('添加用户表单已添加到 DOM');

        // 使用事件委托处理所有表单事件
        form.addEventListener('click', (e) => {
            // 关闭按钮
            if (e.target.classList.contains('modal-close')) {
                console.log('关闭按钮被点击');
                form.remove();
            }

            // 背景点击关闭
            if (e.target === form) {
                console.log('背景被点击');
                form.remove();
            }
        });

        // 表单提交
        const formInner = form.querySelector('.add-user-form-inner');
        formInner.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('表单提交');

            const email = document.getElementById('newEmail').value;
            const password = document.getElementById('newPassword').value;
            
            if (users.has(email)) {
                alert('该邮箱已被注册！');
                return;
            }

            users.set(email, { email, password, isAdmin: false });
            alert('用户添加成功！');
            form.remove();
            
            // 更新用户列表
            this.updateUserList();
        });
    },

    deleteUser(email) {
        if (confirm(`确定要删除用户 ${email} 吗？`)) {
            users.delete(email);
            this.updateUserList();
        }
    },

    updateUserList() {
        const userList = document.querySelector('.user-list');
        if (userList) {
            userList.innerHTML = this.generateUserList();
        }
    },

    open() {
        document.getElementById('loginModal').classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    close() {
        document.getElementById('loginModal').classList.remove('active');
        document.body.style.overflow = '';
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    modal.init();
    
    // 背景动画控制
    const hero = document.querySelector('.hero');
    let isAnimating = true;

    hero.addEventListener('click', () => {
        if (isAnimating) {
            hero.style.animationPlayState = 'paused';
        } else {
            hero.style.animationPlayState = 'running';
        }
        isAnimating = !isAnimating;
    });
}); 