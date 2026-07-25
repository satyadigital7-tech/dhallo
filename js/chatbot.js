/* ==========================================================================
   DHALLO CORPORATE FINANCIAL SERVICES - AI CHATBOT ENGINE
   ========================================================================== */

(function($) {
    "use strict";

    let soundEnabled = true;

    // Web Audio API Synthesizer for Chime Sound (Zero External Assets Required)
    function playChimeSound() {
        if (!soundEnabled) return;
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            if (ctx.state === 'suspended') {
                ctx.resume();
            }
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.12);
        } catch(e) {
            // Audio context permission or fallback ignore
        }
    }

    // Dynamic HTML Injection for Chatbot Container
    function injectChatbotHTML() {
        if ($('#dhallo-chatbot-wrapper').length) return;

        const chatbotHTML = `
        <div id="dhallo-chatbot-wrapper">
            <!-- Proactive Greeting Tooltip -->
            <div id="dhallo-chat-tooltip" class="dhallo-chat-tooltip">
                <span class="dhallo-tooltip-close" id="dhallo-tooltip-close"><i class="fa-solid fa-xmark"></i></span>
                <strong>💬 Need Instant Loan Assistance?</strong>
                Chat with Dhallo AI to check rates, eligibility & 150+ Bank offers in seconds!
            </div>

            <!-- Floating Trigger Button -->
            <button class="dhallo-chat-toggle" id="dhallo-chat-toggle-btn" aria-label="Open Financial Assistant Chat">
                <div class="dhallo-chat-pulse"></div>
                <div class="dhallo-online-dot"></div>
                <div class="dhallo-unread-badge" id="dhallo-unread-badge">1</div>
                <i class="fa-solid fa-comments"></i>
                <i class="fa-solid fa-xmark"></i>
            </button>

            <!-- Chat Window -->
            <div class="dhallo-chat-window" id="dhallo-chat-window">
                <!-- Header -->
                <div class="dhallo-chat-header">
                    <div class="dhallo-chat-bot-info">
                        <div class="dhallo-avatar-container">
                            <img src="images/icon_.png" alt="Dhallo Logo">
                            <div class="dhallo-avatar-status"></div>
                        </div>
                        <div class="dhallo-bot-title-area">
                            <h5>Dhallo AI Assistant</h5>
                            <p><i class="fa-solid fa-circle text-success" style="font-size: 8px;"></i> Online • 150+ Partner Banks</p>
                        </div>
                    </div>
                    <div class="dhallo-chat-header-actions">
                        <button class="dhallo-header-btn" id="dhallo-sound-toggle" title="Toggle Sound">
                            <i class="fa-solid fa-volume-high"></i>
                        </button>
                        <button class="dhallo-header-btn" id="dhallo-clear-chat" title="Clear Chat">
                            <i class="fa-solid fa-rotate-right"></i>
                        </button>
                        <button class="dhallo-header-btn" id="dhallo-close-chat" title="Close">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                </div>

                <!-- Messages Body -->
                <div class="dhallo-chat-body" id="dhallo-chat-body">
                    <!-- Initial Welcome Message will be appended by JS -->
                </div>

                <!-- Footer / Input Form -->
                <div class="dhallo-chat-footer">
                    <form class="dhallo-chat-input-form" id="dhallo-chat-form">
                        <input type="text" id="dhallo-chat-input" placeholder="Ask about Home Loan, Business Loan, EMI..." autocomplete="off" required>
                        <button type="submit" class="dhallo-send-btn" title="Send Message">
                            <i class="fa-solid fa-paper-plane"></i>
                        </button>
                    </form>
                    <div class="dhallo-chat-branding">
                        <i class="fa-solid fa-shield-halved text-success"></i> Powered by Dhallo Corporate Financial Services
                    </div>
                </div>
            </div>
        </div>
        `;

        $('body').append(chatbotHTML);
    }

    // Get current formatted timestamp
    function getTimestamp() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // Scroll chat body to bottom
    function scrollToBottom() {
        const chatBody = document.getElementById('dhallo-chat-body');
        if (chatBody) {
            chatBody.scrollTop = chatBody.scrollHeight;
        }
    }

    // Append User Message
    function appendUserMessage(text) {
        const time = getTimestamp();
        const html = `
            <div class="dhallo-msg user-msg">
                <div class="dhallo-msg-bubble">${escapeHtml(text)}</div>
                <div class="dhallo-msg-time">${time}</div>
            </div>
        `;
        $('#dhallo-chat-body').append(html);
        scrollToBottom();
    }

    // Append Bot Message
    function appendBotMessage(htmlContent, chips = []) {
        const time = getTimestamp();
        let chipsHTML = '';

        if (chips && chips.length > 0) {
            chipsHTML = '<div class="dhallo-chips-container">';
            chips.forEach(chip => {
                const highlightClass = chip.highlight ? 'highlight' : '';
                chipsHTML += `<button type="button" class="dhallo-chip-btn ${highlightClass}" data-action="${chip.action || ''}">${chip.label}</button>`;
            });
            chipsHTML += '</div>';
        }

        const msgHTML = `
            <div class="dhallo-msg bot-msg">
                <div class="dhallo-msg-bubble">
                    ${htmlContent}
                    ${chipsHTML}
                </div>
                <div class="dhallo-msg-time">${time}</div>
            </div>
        `;

        $('#dhallo-chat-body').append(msgHTML);
        scrollToBottom();
        playChimeSound();
    }

    // Show Typing Indicator
    function showTypingIndicator() {
        const typingHTML = `
            <div class="dhallo-msg bot-msg" id="dhallo-typing">
                <div class="dhallo-typing-indicator">
                    <div class="dhallo-typing-dot"></div>
                    <div class="dhallo-typing-dot"></div>
                    <div class="dhallo-typing-dot"></div>
                </div>
            </div>
        `;
        $('#dhallo-chat-body').append(typingHTML);
        scrollToBottom();
    }

    // Remove Typing Indicator
    function hideTypingIndicator() {
        $('#dhallo-typing').remove();
    }

    // HTML escape utility
    function escapeHtml(text) {
        return $('<div>').text(text).html();
    }

    // Default Initial Welcome Message
    function showWelcomeMessage() {
        $('#dhallo-chat-body').empty();
        const welcomeHTML = `
            👋 <strong>Welcome to Dhallo Corporate Financial Services!</strong><br>
            I am your instant AI Loan Advisor. I can help you find the best interest rates from 150+ Banks & NBFCs, check eligibility, calculate EMI, or get instant approval!
            <br><br>
            <strong>What would you like to explore today?</strong>
        `;

        const welcomeChips = [
            { label: '🏠 Home Loan', action: 'home_loan' },
            { label: '💼 Business Loan', action: 'business_loan' },
            { label: '🏢 Loan Against Property', action: 'lap_loan' },
            { label: '🚘 Car & Working Capital', action: 'other_loans' },
            { label: '🧮 EMI Calculator', action: 'emi_calc' },
            { label: '📋 Instant Loan Application', action: 'open_modal', highlight: true },
            { label: '📞 Contact Senior Advisor', action: 'contact_advisor' }
        ];

        appendBotMessage(welcomeHTML, welcomeChips);
    }

    // Bot Response Logic Engine
    function processUserMessage(userText) {
        showTypingIndicator();

        setTimeout(() => {
            hideTypingIndicator();

            const text = userText.toLowerCase().trim();

            if (text.includes('home loan') || text.includes('house loan') || text.includes('mortgage') || text.includes('flat loan')) {
                const response = `
                    🏠 <strong>Dhallo Home Loan Overview:</strong><br>
                    • <strong>Lowest Interest Rates:</strong> Starting at 8.35% p.a.<br>
                    • <strong>Max Tenure:</strong> Up to 30 Years<br>
                    • <strong>Loan Amount:</strong> Up to ₹10 Crores<br>
                    • <strong>Partner Banks:</strong> SBI, HDFC, ICICI, Axis, Kotak & 150+ Banks<br>
                    • <strong>Special Benefits:</strong> Zero doorstep collection fees, fast sanction in 48 hrs.<br><br>
                    Would you like to check your eligibility or apply now?
                `;
                const chips = [
                    { label: '⚡ Apply for Home Loan', action: 'apply_home_loan', highlight: true },
                    { label: '📄 Required Documents', action: 'docs_home' },
                    { label: '🧮 Check EMI', action: 'emi_calc' },
                    { label: '↩️ Main Menu', action: 'welcome' }
                ];
                appendBotMessage(response, chips);

            } else if (text.includes('business loan') || text.includes('msme') || text.includes('working capital') || text.includes('commercial')) {
                const response = `
                    💼 <strong>Dhallo Business & Working Capital Loans:</strong><br>
                    • <strong>Collateral-Free Loans:</strong> Up to ₹50 Lakhs<br>
                    • <strong>Secured Business LAP:</strong> Up to ₹10 Crores<br>
                    • <strong>Interest Rate:</strong> Starting at 11.25% p.a.<br>
                    • <strong>Approval Time:</strong> 24 to 48 Hours<br>
                    • <strong>Flexible Options:</strong> Overdraft, Machinery Finance & Term Loans.<br><br>
                    Empower your business growth today!
                `;
                const chips = [
                    { label: '⚡ Apply for Business Loan', action: 'apply_business_loan', highlight: true },
                    { label: '📄 Business Loan Docs', action: 'docs_business' },
                    { label: '↩️ Main Menu', action: 'welcome' }
                ];
                appendBotMessage(response, chips);

            } else if (text.includes('property') || text.includes('lap') || text.includes('against property')) {
                const response = `
                    🏢 <strong>Loan Against Property (LAP):</strong><br>
                    • <strong>Interest Rate:</strong> Starting at 9.15% p.a.<br>
                    • <strong>Tenure:</strong> Up to 15 Years<br>
                    • <strong>LTV Ratio:</strong> Get up to 75% of your property market value<br>
                    • <strong>Property Types:</strong> Residential, Commercial, Industrial & Plot.<br><br>
                    Unlock the hidden cash value of your property!
                `;
                const chips = [
                    { label: '⚡ Apply for LAP', action: 'apply_lap', highlight: true },
                    { label: '📞 Request Call back', action: 'contact_advisor' },
                    { label: '↩️ Main Menu', action: 'welcome' }
                ];
                appendBotMessage(response, chips);

            } else if (text.includes('emi') || text.includes('calculator') || text.includes('calculate')) {
                const response = `
                    🧮 <strong>Instant Loan EMI Calculator Example:</strong><br><br>
                    • <strong>For ₹50 Lakh Home Loan @ 8.5% for 20 Years:</strong><br>
                      👉 Monthly EMI: <strong>₹43,391 / month</strong><br><br>
                    • <strong>For ₹10 Lakh Business Loan @ 12% for 3 Years:</strong><br>
                      👉 Monthly EMI: <strong>₹33,214 / month</strong><br><br>
                    Our Dhallo financial advisors can negotiate customized repayment schedules tailored to your cashflow.
                `;
                const chips = [
                    { label: '📋 Apply for Exact Quote', action: 'open_modal', highlight: true },
                    { label: '↩️ Main Menu', action: 'welcome' }
                ];
                appendBotMessage(response, chips);

            } else if (text.includes('document') || text.includes('paper') || text.includes('proof')) {
                const response = `
                    📄 <strong>Standard Document Checklist:</strong><br>
                    1. <strong>Identity Proof:</strong> PAN Card & Aadhaar Card<br>
                    2. <strong>Address Proof:</strong> Passport / Electricity Bill / Voter ID<br>
                    3. <strong>Income Proof (Salaried):</strong> 3 Months Payslips & 6 Months Bank Statement<br>
                    4. <strong>Income Proof (Self-Employed):</strong> 2-3 Years ITR with Computation & Profit/Loss Statement<br>
                    5. <strong>Property Papers:</strong> Title Deed & Link Documents (for LAP / Home Loan).
                `;
                const chips = [
                    { label: '📋 Start Digital Application', action: 'open_modal', highlight: true },
                    { label: '↩️ Main Menu', action: 'welcome' }
                ];
                appendBotMessage(response, chips);

            } else if (text.includes('eligibility') || text.includes('cibil') || text.includes('score')) {
                const response = `
                    📊 <strong>Loan Eligibility Guidelines:</strong><br>
                    • <strong>Age Limit:</strong> 21 to 65 Years<br>
                    • <strong>Minimum Income:</strong> ₹25,000/mo (Salaried) or ₹3 Lakhs/yr ITR (Self-Employed)<br>
                    • <strong>Ideal CIBIL Score:</strong> 720+ (Loans still available for score 650+)<br><br>
                    We work with 150+ Banks & NBFCs, ensuring high approval chances even for complex profiles!
                `;
                const chips = [
                    { label: '⚡ Submit Details for Eligibility Check', action: 'open_modal', highlight: true },
                    { label: '↩️ Main Menu', action: 'welcome' }
                ];
                appendBotMessage(response, chips);

            } else if (text.includes('contact') || text.includes('phone') || text.includes('number') || text.includes('address') || text.includes('location') || text.includes('hyderabad')) {
                const response = `
                    📞 <strong>Dhallo Corporate Financial Services:</strong><br>
                    📍 <strong>Office Address:</strong> Plot No. 12, Corporate Towers, Financial District, Gachibowli / Madhapur, Hyderabad, Telangana 500032.<br>
                    ☎️ <strong>Direct Phone:</strong> +91 96663 95995<br>
                    ✉️ <strong>Email:</strong> dhallofinancialservices@gmail.com<br>
                    🕒 <strong>Working Hours:</strong> Mon - Sat: 9:30 AM - 7:00 PM
                `;
                const chips = [
                    { label: '💬 Apply Online Now', action: 'open_modal', highlight: true },
                    { label: '↩️ Main Menu', action: 'welcome' }
                ];
                appendBotMessage(response, chips);

            } else if (text.includes('apply') || text.includes('form') || text.includes('register') || text.includes('book')) {
                const response = `
                    🚀 <strong>Instant Application Ready!</strong><br>
                    Opening our instant digital application modal for you now...
                `;
                appendBotMessage(response);
                setTimeout(() => {
                    if (typeof openLoanModal === 'function') {
                        openLoanModal('General Loan');
                    }
                }, 600);

            } else if (text.includes('hi') || text.includes('hello') || text.includes('hey') || text.includes('namaste')) {
                const response = `
                    Hello! 👋 Great to meet you! How can Dhallo Corporate Financial Services assist your financial goals today?
                `;
                const chips = [
                    { label: '🏠 Home Loan', action: 'home_loan' },
                    { label: '💼 Business Loan', action: 'business_loan' },
                    { label: '⚡ Apply Now', action: 'open_modal', highlight: true }
                ];
                appendBotMessage(response, chips);

            } else {
                const response = `
                    Thank you for reaching out! I understand you are inquiring about <em>"${escapeHtml(userText)}"</em>.<br><br>
                    Our Senior Financial Consultants are ready to compare 150+ Banks & NBFCs to offer you the lowest interest rate and maximum loan amount.
                `;
                const chips = [
                    { label: '📋 Apply for Instant Quote', action: 'open_modal', highlight: true },
                    { label: '📞 Contact Advisor (+91 96663 95995)', action: 'contact_advisor' },
                    { label: '↩️ Main Menu', action: 'welcome' }
                ];
                appendBotMessage(response, chips);
            }
        }, 500);
    }

    // Handle Chip Clicks
    $(document).on('click', '.dhallo-chip-btn', function() {
        const action = $(this).data('action');
        const chipText = $(this).text().trim();

        if (action === 'open_modal') {
            appendUserMessage(chipText);
            if (typeof openLoanModal === 'function') {
                openLoanModal('Instant Financial Consultation');
            }
            return;
        }

        if (action === 'apply_home_loan') {
            appendUserMessage(chipText);
            if (typeof openLoanModal === 'function') {
                openLoanModal('Home Loan');
            }
            return;
        }

        if (action === 'apply_business_loan') {
            appendUserMessage(chipText);
            if (typeof openLoanModal === 'function') {
                openLoanModal('Business Loan');
            }
            return;
        }

        if (action === 'apply_lap') {
            appendUserMessage(chipText);
            if (typeof openLoanModal === 'function') {
                openLoanModal('Loan Against Property (LAP)');
            }
            return;
        }

        if (action === 'contact_advisor') {
            appendUserMessage(chipText);
            window.location.href = 'tel:+919666395995';
            return;
        }

        if (action === 'welcome') {
            showWelcomeMessage();
            return;
        }

        // Default chip click: process as user message input
        appendUserMessage(chipText);
        processUserMessage(chipText);
    });

    // DOM Ready Initialization
    $(document).ready(function() {
        // 1. Inject Chatbot DOM Structure
        injectChatbotHTML();

        // 2. Load Initial Welcome Message
        showWelcomeMessage();

        // 3. Proactive Greeting Tooltip Timer (Appears after 3s)
        setTimeout(() => {
            if (!$('#dhallo-chat-window').hasClass('open')) {
                $('#dhallo-chat-tooltip').fadeIn(400);
            }
        }, 3000);

        // Tooltip Click Handler
        $(document).on('click', '#dhallo-chat-tooltip', function(e) {
            if ($(e.target).closest('#dhallo-tooltip-close').length) {
                e.stopPropagation();
                $('#dhallo-chat-tooltip').fadeOut(200);
                return;
            }
            $('#dhallo-chat-tooltip').fadeOut(200);
            $('#dhallo-chat-window').addClass('open');
            $('#dhallo-chat-toggle-btn').addClass('active');
            $('#dhallo-unread-badge').hide();
        });

        // Toggle Chat Window
        $(document).on('click', '#dhallo-chat-toggle-btn', function() {
            const windowEl = $('#dhallo-chat-window');
            const isOpening = !windowEl.hasClass('open');

            windowEl.toggleClass('open');
            $(this).toggleClass('active');
            $('#dhallo-chat-tooltip').fadeOut(200);
            $('#dhallo-unread-badge').hide();

            if (isOpening) {
                scrollToBottom();
                setTimeout(() => $('#dhallo-chat-input').focus(), 300);
            }
        });

        // Close Chat Button
        $(document).on('click', '#dhallo-close-chat', function() {
            $('#dhallo-chat-window').removeClass('open');
            $('#dhallo-chat-toggle-btn').removeClass('active');
        });

        // Sound Toggle
        $(document).on('click', '#dhallo-sound-toggle', function() {
            soundEnabled = !soundEnabled;
            const icon = $(this).find('i');
            if (soundEnabled) {
                icon.removeClass('fa-volume-xmark').addClass('fa-volume-high');
                $(this).css('color', '#FFFFFF');
                playChimeSound();
            } else {
                icon.removeClass('fa-volume-high').addClass('fa-volume-xmark');
                $(this).css('color', '#EF4444');
            }
        });

        // Clear Chat
        $(document).on('click', '#dhallo-clear-chat', function() {
            showWelcomeMessage();
        });

        // Chat Form Submit
        $(document).on('submit', '#dhallo-chat-form', function(e) {
            e.preventDefault();
            const inputEl = $('#dhallo-chat-input');
            const text = inputEl.val().trim();
            if (!text) return;

            appendUserMessage(text);
            inputEl.val('');
            processUserMessage(text);
        });

        /* ==========================================================================
           AUTOMATIC HOME PAGE POPUP MODAL TRIGGER
           "user open the website automatically come"
           ========================================================================== */
        const isHomePage = $('body').hasClass('home-page') || 
                           window.location.pathname.endsWith('index.html') || 
                           window.location.pathname === '/' || 
                           window.location.pathname === '';

        if (isHomePage) {
            // Auto open the popup modal after page load & preloader fade out (1.4s)
            setTimeout(function() {
                if (typeof openLoanModal === 'function') {
                    openLoanModal('Instant Financial Consultation');
                } else {
                    const modalEl = document.getElementById('loanApplyModal');
                    if (modalEl && typeof bootstrap !== 'undefined') {
                        const bsModal = new bootstrap.Modal(modalEl);
                        bsModal.show();
                    }
                }
            }, 1400);
        }
    });

})(jQuery);
