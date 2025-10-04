// Main TypeScript file for SubText website

class WebsiteApp {
    private ctaButton: HTMLButtonElement | null = null;
    private contactForm: HTMLFormElement | null = null;

    constructor() {
        this.init();
    }

    private init(): void {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
        } else {
            this.setupEventListeners();
        }
    }

    private setupEventListeners(): void {
        this.setupCTAButton();
        this.setupContactForm();
        this.setupSmoothScrolling();
        this.setupNavbarHighlight();
    }

    private setupCTAButton(): void {
        this.ctaButton = document.getElementById('cta-button') as HTMLButtonElement;
        if (this.ctaButton) {
            this.ctaButton.addEventListener('click', () => {
                this.handleCTAClick();
            });
        }
    }

    private setupContactForm(): void {
        this.contactForm = document.getElementById('contact-form') as HTMLFormElement;
        if (this.contactForm) {
            this.contactForm.addEventListener('submit', (e) => {
                this.handleFormSubmit(e);
            });
        }
    }

    private setupSmoothScrolling(): void {
        const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href')?.substring(1);
                if (targetId) {
                    this.scrollToSection(targetId);
                }
            });
        });
    }

    private setupNavbarHighlight(): void {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.getBoundingClientRect().top;
                if (sectionTop <= 100) {
                    current = section.getAttribute('id') || '';
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    private handleCTAClick(): void {
        console.log('CTA button clicked!');
        
        // Add some interactive feedback
        if (this.ctaButton) {
            const originalText = this.ctaButton.textContent;
            this.ctaButton.textContent = 'Getting Started...';
            this.ctaButton.style.background = '#28a745';
            
            setTimeout(() => {
                if (this.ctaButton) {
                    this.ctaButton.textContent = originalText;
                    this.ctaButton.style.background = '#ffd700';
                }
            }, 2000);
        }

        // Scroll to services section
        this.scrollToSection('services');
    }

    private handleFormSubmit(e: Event): void {
        e.preventDefault();
        
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        
        // Get form values
        const name = (document.getElementById('name') as HTMLInputElement)?.value;
        const email = (document.getElementById('email') as HTMLInputElement)?.value;
        const message = (document.getElementById('message') as HTMLTextAreaElement)?.value;

        if (name && email && message) {
            console.log('Form submitted:', { name, email, message });
            
            // Show success message
            this.showNotification('Message sent successfully!', 'success');
            
            // Reset form
            form.reset();
        } else {
            this.showNotification('Please fill in all fields', 'error');
        }
    }

    private scrollToSection(sectionId: string): void {
        const section = document.getElementById(sectionId);
        if (section) {
            const headerHeight = 80;
            const sectionTop = section.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: sectionTop,
                behavior: 'smooth'
            });
        }
    }

    private showNotification(message: string, type: 'success' | 'error'): void {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            ${type === 'success' ? 'background: #28a745;' : 'background: #dc3545;'}
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Utility functions
const utils = {
    // Debounce function for performance optimization
    debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
        let timeout: NodeJS.Timeout;
        return (...args: Parameters<T>) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(null, args), wait);
        };
    },

    // Throttle function for scroll events
    throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
        let inThrottle: boolean;
        return (...args: Parameters<T>) => {
            if (!inThrottle) {
                func.apply(null, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Check if element is in viewport
    isInViewport(element: Element): boolean {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// Initialize the application when the script loads
const app = new WebsiteApp();

// Add some CSS for active nav links
const style = document.createElement('style');
style.textContent = `
    .nav-links a.active {
        color: #ffd700 !important;
        font-weight: bold;
    }
`;
document.head.appendChild(style);

// Export for potential module usage
export { WebsiteApp, utils };
