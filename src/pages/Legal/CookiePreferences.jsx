import React from 'react';
import './styles.css';

const CookiePreferences = () => {

    return (
        <div className="page-wrapper legal-page">
            <main className="legal-content">
                <h1>Cookie Preferences</h1>
                <p className="last-updated">Last Updated: March 5, 2025</p>

                {/* ── Introduction ── */}
                <section>
                    <h2>What Are Cookies?</h2>
                    <p>Cookies are small text files that are placed on your device (computer, tablet, or mobile phone) when you visit a website. They are widely used to make websites work more efficiently, provide a better user experience, and supply information to the website operators.</p>
                    <p>Joe4cast ("Service", "Platform", "we", "us") uses cookies and similar technologies (such as local storage and session storage) to operate essential site functionality, remember your preferences, and understand how you interact with the Platform.</p>
                    <p>This Cookie Policy explains what cookies we use, why we use them, and how you can control your preferences. By continuing to use the Service, you consent to the use of cookies as described in this policy and based on your selections below.</p>
                </section>

                {/* ── Types of Cookies ── */}
                <section>
                    <h2>Types of Cookies We Use</h2>
                    <p>The cookies used on the Joe4cast Platform can be categorized as follows:</p>

                    <h3>Strictly Necessary (Essential) Cookies</h3>
                    <p>These cookies are required for the Platform to function correctly. Without them, you would not be able to sign in, maintain your session, or use core features. These cookies cannot be disabled.</p>
                    <ul>
                        <li><strong>Authentication Tokens:</strong> Maintain your signed-in session via Google Firebase Authentication. Without these, you would need to sign in on every page visit.</li>
                        <li><strong>Session State:</strong> Preserve your current session context as you navigate between pages.</li>
                        <li><strong>Security Cookies:</strong> Help detect and prevent fraudulent activity and protect your account.</li>
                    </ul>

                    <h3>Functional (Preference) Cookies</h3>
                    <p>These cookies allow the Platform to remember your choices and provide enhanced, personalized features. Disabling them may result in a degraded experience.</p>
                    <ul>
                        <li><strong>Theme Preferences:</strong> Stores your selected visual theme (Dark, Light, Ocean, Forest, Gold, etc.) so it persists across sessions.</li>
                        <li><strong>Layout Settings:</strong> Remembers your card size, glass level, and metadata display preferences.</li>
                        <li><strong>Background Pattern:</strong> Stores your selected background pattern preference.</li>
                        <li><strong>Cookie Consent:</strong> Remembers your cookie preference selections so you are not asked again on every visit.</li>
                    </ul>

                    <h3>Analytics and Performance Cookies</h3>
                    <p>These cookies collect aggregated, anonymous information about how visitors use the Platform. This data helps us understand usage patterns, identify issues, and improve the Service. No personally identifiable information is collected through analytics cookies.</p>
                    <ul>
                        <li><strong>Page Visit Tracking:</strong> Records which pages are visited and how users navigate the Platform.</li>
                        <li><strong>Performance Metrics:</strong> Measures page load times and identifies performance bottlenecks.</li>
                        <li><strong>Feature Usage:</strong> Tracks which features are most frequently used to guide development priorities.</li>
                    </ul>

                    <h3>Marketing and Advertising Cookies</h3>
                    <p>These cookies may be used in the future to deliver relevant advertisements or content recommendations. Currently, Joe4cast does not serve third-party advertisements. If this changes, this section will be updated accordingly.</p>
                </section>

                {/* ── Third-Party Cookies ── */}
                <section>
                    <h2>Third-Party Cookies</h2>
                    <p>Some cookies on the Platform are set by third-party services that we use to operate the Service. These third parties have their own cookie and privacy policies, which we encourage you to review:</p>
                    <ul>
                        <li><strong>Google Firebase:</strong> Sets authentication and session management cookies. See <a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noopener noreferrer">Google's Cookie Policy</a>.</li>
                        <li><strong>Google Sign-In:</strong> May set cookies related to the OAuth 2.0 authentication flow. See <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google's Privacy Policy</a>.</li>
                    </ul>
                    <p>We do not control the cookies set by third-party services and are not responsible for their content or data practices.</p>
                </section>

                {/* ── Local Storage ── */}
                <section>
                    <h2>Local Storage and Session Storage</h2>
                    <p>In addition to cookies, Joe4cast uses browser local storage and session storage to store certain data on your device. These technologies function similarly to cookies but can store larger amounts of data and are not transmitted to our servers with every request.</p>
                    <p><strong>Data stored in local storage includes:</strong></p>
                    <ul>
                        <li>Theme and appearance preferences</li>
                        <li>Layout configuration settings</li>
                        <li>Cookie consent preferences</li>
                    </ul>
                    <p><strong>Data stored in session storage includes:</strong></p>
                    <ul>
                        <li>Cached AI recommendation results (cleared when the browser tab is closed)</li>
                        <li>Temporary navigation state</li>
                    </ul>
                    <p>You can clear local and session storage at any time through your browser's developer tools or settings, or by using the "Factory Reset" option in the Settings page.</p>
                </section>

                {/* ── Toggle Controls ── */}
                <section>
                    <h2>Summary of Cookies Used</h2>
                    <p>Below is a summary of the cookie categories currently active on Joe4cast and their status:</p>

                    <div className="cookie-settings">
                        <div className="cookie-option">
                            <div className="cookie-option-header">
                                <h3>Essential Cookies</h3>
                                <span className="cookie-status active">Always Active</span>
                            </div>
                            <p>Required for authentication, session management, and core functionality. These cookies are always active and cannot be disabled.</p>
                        </div>

                        <div className="cookie-option">
                            <div className="cookie-option-header">
                                <h3>Functional Cookies</h3>
                                <span className="cookie-status active">Active</span>
                            </div>
                            <p>Remember your theme, layout, and display preferences for a consistent experience across sessions. You can clear these anytime via Settings → Data & Import → Factory Reset.</p>
                        </div>

                        <div className="cookie-option">
                            <div className="cookie-option-header">
                                <h3>Analytics Cookies</h3>
                                <span className="cookie-status inactive">Not Used</span>
                            </div>
                            <p>Joe4cast does not currently use any analytics or tracking cookies. If this changes in the future, this page will be updated and your consent will be requested.</p>
                        </div>

                        <div className="cookie-option">
                            <div className="cookie-option-header">
                                <h3>Marketing Cookies</h3>
                                <span className="cookie-status inactive">Not Used</span>
                            </div>
                            <p>Joe4cast does not serve third-party advertisements and does not use any marketing or advertising cookies.</p>
                        </div>
                    </div>
                </section>

                {/* ── Browser Controls ── */}
                <section>
                    <h2>How to Control Cookies via Your Browser</h2>
                    <p>Most web browsers allow you to control cookies through their settings. You can typically find these options in the "Settings", "Preferences", or "Privacy" menu of your browser. Below are links to cookie management instructions for popular browsers:</p>
                    <ul>
                        <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
                        <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
                        <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer">Apple Safari</a></li>
                        <li><a href="https://support.microsoft.com/en-us/microsoft-edge/manage-cookies-in-microsoft-edge-view-allow-block-delete-and-use-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
                    </ul>
                    <p><strong>Please note:</strong> Blocking or deleting cookies may impact the functionality of the Platform. Essential features such as authentication and session management require cookies to operate correctly.</p>
                </section>

                {/* ── Legal Basis ── */}
                <section>
                    <h2>Legal Basis for Using Cookies</h2>
                    <p>We use cookies based on the following legal grounds:</p>
                    <ul>
                        <li><strong>Legitimate Interest:</strong> Essential and functional cookies are necessary for the proper operation of the Service and to provide you with the features you request.</li>
                        <li><strong>Consent:</strong> For analytics and marketing cookies, we rely on your explicit consent, which you can manage through the preference toggles above.</li>
                    </ul>
                    <p>You may withdraw your consent at any time by returning to this page and updating your preferences, or by clearing cookies through your browser settings.</p>
                </section>

                {/* ── Updates ── */}
                <section>
                    <h2>Changes to This Cookie Policy</h2>
                    <p>We may update this Cookie Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. Any changes will be posted on this page with an updated "Last Updated" date. We encourage you to review this policy periodically.</p>
                    <p>Your continued use of the Service after any modifications to this Cookie Policy constitutes your acceptance of such modifications.</p>
                </section>

                {/* ── Contact ── */}
                <section>
                    <h2>Contact Us</h2>
                    <p>If you have any questions about our use of cookies or this Cookie Policy, please contact the Joe4cast development team through our official GitHub repository at <a href="https://github.com/ADET-AI-Assistant/Joe4cast" target="_blank" rel="noopener noreferrer">github.com/ADET-AI-Assistant/Joe4cast</a>.</p>
                </section>
            </main>
        </div>
    );
};

export default CookiePreferences;
