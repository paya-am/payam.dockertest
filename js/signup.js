// Sign Up Form Validation and Logic

class SignUpForm {
    constructor() {
        this.form = document.getElementById('signupForm');
        this.formData = {};

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Password visibility toggle
        document.getElementById('togglePassword').addEventListener('click', (e) => {
            e.preventDefault();
            this.togglePasswordVisibility('password', 'togglePassword');
        });

        document.getElementById('toggleConfirmPassword').addEventListener('click', (e) => {
            e.preventDefault();
            this.togglePasswordVisibility('confirmPassword', 'toggleConfirmPassword');
        });

        // Password input - show requirements
        document.getElementById('password').addEventListener('focus', () => {
            document.querySelector('.password-requirements').classList.add('show');
        });

        document.getElementById('password').addEventListener('input', () => {
            this.updatePasswordRequirements();
        });

        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.validateForm();
        });

        // Validation slide buttons
        document.getElementById('go-to-login').addEventListener('click', () => {
            window.location.href = 'login.html';
        });

        document.getElementById('go-back').addEventListener('click', () => {
            this.resetForm();
        });

        // Real-time validation
        document.getElementById('fullname').addEventListener('blur', () => this.validateField('fullname'));
        document.getElementById('username').addEventListener('blur', () => this.validateField('username'));
        document.getElementById('email').addEventListener('blur', () => this.validateField('email'));
        document.getElementById('gender').addEventListener('change', () => this.validateField('gender'));
        document.getElementById('dob').addEventListener('change', () => this.validateField('dob'));
    }

    togglePasswordVisibility(fieldId, buttonId) {
        const field = document.getElementById(fieldId);
        const button = document.getElementById(buttonId);

        if (field.type === 'password') {
            field.type = 'text';
            button.textContent = '🙈';
        } else {
            field.type = 'password';
            button.textContent = '👁️';
        }
    }

    updatePasswordRequirements() {
        const password = document.getElementById('password').value;

        // Capital letter
        const hasCapital = /[A-Z]/.test(password);
        this.updateRequirement('req-capital', hasCapital);

        // Small letter
        const hasSmall = /[a-z]/.test(password);
        this.updateRequirement('req-small', hasSmall);

        // Number
        const hasNumber = /[0-9]/.test(password);
        this.updateRequirement('req-number', hasNumber);

        // Special character (@, #, $, !)
        const hasSpecial = /[@#$!]/.test(password);
        this.updateRequirement('req-special', hasSpecial);

        // Length
        const hasLength = password.length >= 8;
        this.updateRequirement('req-length', hasLength);
    }

    updateRequirement(elementId, isMet) {
        const element = document.getElementById(elementId);
        if (isMet) {
            element.classList.add('met');
            element.querySelector('.requirement-icon').textContent = '✓';
        } else {
            element.classList.remove('met');
            element.querySelector('.requirement-icon').textContent = '✗';
        }
    }

    validatePasswordRequirements(password) {
        const requirements = {
            capital: /[A-Z]/.test(password),
            small: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[@#$!]/.test(password),
            length: password.length >= 8
        };

        return Object.values(requirements).every(req => req);
    }

    getUsers() {
        const saved = localStorage.getItem('payam-users');
        return saved ? JSON.parse(saved) : [];
    }

    saveUsers(users) {
        localStorage.setItem('payam-users', JSON.stringify(users));
    }

    saveUser(user) {
        const users = this.getUsers();
        users.push(user);
        this.saveUsers(users);
    }

    validateField(fieldName) {
        const field = document.getElementById(fieldName);
        const errorElement = document.getElementById(`${fieldName}-error`);
        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'fullname':
                if (field.value.trim() === '') {
                    isValid = false;
                    errorMessage = 'Full name is required';
                } else if (field.value.trim().length < 3) {
                    isValid = false;
                    errorMessage = 'Full name must be at least 3 characters';
                }
                break;

            case 'username':
                if (field.value.trim() === '') {
                    isValid = false;
                    errorMessage = 'Username is required';
                } else if (field.value.trim().length < 3) {
                    isValid = false;
                    errorMessage = 'Username must be at least 3 characters';
                } else if (!/^[a-zA-Z0-9_-]+$/.test(field.value)) {
                    isValid = false;
                    errorMessage = 'Username can only contain letters, numbers, - and _';
                }
                break;

            case 'email':
                const emailRegex = /^[^\s@]+@gmail\.com$/;
                if (field.value === '') {
                    isValid = false;
                    errorMessage = 'Email is required';
                } else if (!emailRegex.test(field.value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid Gmail address';
                }
                break;

            case 'gender':
                if (field.value === '') {
                    isValid = false;
                    errorMessage = 'Please select your gender';
                }
                break;

            case 'dob':
                if (field.value === '') {
                    isValid = false;
                    errorMessage = 'Date of birth is required';
                } else {
                    const age = this.calculateAge(new Date(field.value));
                    if (age < 13) {
                        isValid = false;
                        errorMessage = 'You must be at least 13 years old';
                    } else if (age > 120) {
                        isValid = false;
                        errorMessage = 'Please enter a valid date of birth';
                    }
                }
                break;
        }

        if (!isValid) {
            field.style.borderColor = '#e74c3c';
            errorElement.textContent = errorMessage;
        } else {
            field.style.borderColor = '#4caf50';
            errorElement.textContent = '';
        }

        return isValid;
    }

    calculateAge(birthDate) {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    }

    validateForm() {
        // Validate all fields
        const isFullnameValid = this.validateField('fullname');
        const isUsernameValid = this.validateField('username');
        const isEmailValid = this.validateField('email');
        const isGenderValid = this.validateField('gender');
        const isDobValid = this.validateField('dob');

        // Validate passwords
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const passwordError = document.getElementById('password-error');
        const confirmError = document.getElementById('confirmPassword-error');

        let isPasswordValid = true;
        let isConfirmValid = true;

        if (password === '') {
            passwordError.textContent = 'Password is required';
            isPasswordValid = false;
        } else if (!this.validatePasswordRequirements(password)) {
            passwordError.textContent = 'Password does not meet all requirements';
            isPasswordValid = false;
        } else {
            passwordError.textContent = '';
        }

        if (confirmPassword === '') {
            confirmError.textContent = 'Please confirm your password';
            isConfirmValid = false;
        } else if (password !== confirmPassword) {
            confirmError.textContent = 'Passwords do not match';
            isConfirmValid = false;
        } else {
            confirmError.textContent = '';
        }

        // Check for duplicate username before success
        const username = document.getElementById('username').value.trim();
        const existingUsers = this.getUsers();
        const usernameTaken = existingUsers.some((user) => user.username.toLowerCase() === username.toLowerCase());

        if (usernameTaken) {
            document.getElementById('username-error').textContent = 'This username is already taken.';
            document.getElementById('username').style.borderColor = '#e74c3c';
            return;
        }

        // If all valid, show success slide
        if (isFullnameValid && isUsernameValid && isEmailValid && isGenderValid && isDobValid && 
            isPasswordValid && isConfirmValid) {
            this.showValidationSlide();
        }
    }

    showValidationSlide() {
        // Collect form data
        this.formData = {
            fullname: document.getElementById('fullname').value,
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            gender: document.getElementById('gender').value,
            dob: document.getElementById('dob').value
        };

        // Update summary
        document.getElementById('summary-fullname').textContent = this.formData.fullname;
        document.getElementById('summary-username').textContent = this.formData.username;
        document.getElementById('summary-email').textContent = this.formData.email;
        document.getElementById('summary-gender').textContent = this.formData.gender.charAt(0).toUpperCase() + this.formData.gender.slice(1);
        document.getElementById('summary-dob').textContent = new Date(this.formData.dob).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Hide form, show validation slide
        document.getElementById('signup-form').classList.remove('active');
        document.getElementById('validation-slide').classList.add('active');

        // Save user account for login
        this.saveUser({
            fullname: this.formData.fullname,
            username: this.formData.username,
            email: this.formData.email,
            password: this.formData.password,
            gender: this.formData.gender,
            dob: this.formData.dob
        });

        // Keep demo signupData for summary if desired
        localStorage.setItem('signupData', JSON.stringify(this.formData));

        // Redirect to login page after successful signup
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 800);
    }

    resetForm() {
        this.form.reset();
        
        // Reset border colors
        document.querySelectorAll('input, select').forEach(field => {
            field.style.borderColor = '#e0e0e0';
        });

        // Clear all errors
        document.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
        });

        // Hide password requirements
        document.querySelector('.password-requirements').classList.remove('show');

        // Reset password icons
        document.getElementById('password').type = 'password';
        document.getElementById('confirmPassword').type = 'password';
        document.getElementById('togglePassword').textContent = '👁️';
        document.getElementById('toggleConfirmPassword').textContent = '👁️';

        // Show form, hide validation slide
        document.getElementById('signup-form').classList.add('active');
        document.getElementById('validation-slide').classList.remove('active');
    }
}

// Initialize form when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SignUpForm();
});
