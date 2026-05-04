import React from 'react';
import './styles.css';

const PrivacyPolicy = () => {
    return (
        <div className="page-wrapper legal-page">
            <main className="legal-content">
                <h1>Privacy Policy</h1>
                <p className="last-updated">Last Updated: March 5, 2025</p>

                <section>
                    <h2>1. Introduction</h2>
                    <p>This Privacy Policy describes how Joe4cast ("Service", "Platform", "we", "us", or "our") collects, uses, stores, and protects information obtained from users ("User", "you", "your") of the Platform. By using the Service, you consent to the data practices described in this policy.</p>
                    <p>We are committed to safeguarding the privacy of our users. This policy applies to all information collected through our website, applications, and any related services, sales, marketing, or events (collectively, the "Services").</p>
                </section>

                <section>
                    <h2>2. Information We Collect</h2>
                    <p>We collect information to provide and improve the Service. The types of information we collect include:</p>

                    <h3>2.1 Information You Provide Directly</h3>
                    <ul>
                        <li><strong>Account Information:</strong> When you sign in using a third-party authentication provider (e.g., Google), we receive your display name, email address, and profile photo URL as provided by that authentication service.</li>
                        <li><strong>User Preferences:</strong> Your selected theme, layout preferences, and other customization settings that you configure within the Platform.</li>
                        <li><strong>Watchlist Data:</strong> Movies and TV shows that you manually add to your watchlist.</li>
                        <li><strong>AI Taste Matcher Inputs:</strong> Preferences, genres, and other selections you provide to our AI-powered recommendation feature.</li>
                    </ul>

                    <h3>2.2 Information Collected Automatically</h3>
                    <ul>
                        <li><strong>Viewing History:</strong> Records of content pages you visit and interact with on the Platform ("Continue Watching" data).</li>
                        <li><strong>Watch Time:</strong> Aggregated total time spent viewing content through the Service.</li>
                        <li><strong>Device Information:</strong> Browser type, operating system, screen resolution, and device type used to access the Service.</li>
                        <li><strong>Usage Data:</strong> Pages visited, features used, click interactions, and navigation patterns within the Platform.</li>
                        <li><strong>Cookies and Local Storage:</strong> Small data files stored on your device to maintain session state, preferences, and authentication tokens.</li>
                    </ul>

                    <h3>2.3 Information We Do NOT Collect</h3>
                    <ul>
                        <li>We do <strong>not</strong> collect payment or financial information.</li>
                        <li>We do <strong>not</strong> collect precise geolocation data.</li>
                        <li>We do <strong>not</strong> collect biometric data.</li>
                        <li>We do <strong>not</strong> access your contacts, camera, microphone, or other device sensors.</li>
                    </ul>
                </section>

                <section>
                    <h2>3. How We Use Your Information</h2>
                    <p>We use the information we collect for the following purposes:</p>
                    <ul>
                        <li><strong>Service Delivery:</strong> To provide, operate, and maintain the Platform and its features, including personalized recommendations, watchlists, and viewing history.</li>
                        <li><strong>Personalization:</strong> To customize your experience, including theme preferences, layout settings, and AI-powered content suggestions.</li>
                        <li><strong>Improvement:</strong> To understand how users interact with the Service in order to improve functionality, performance, and user experience.</li>
                        <li><strong>Security:</strong> To detect, prevent, and address technical issues, abuse, fraud, or violations of our Terms of Service.</li>
                        <li><strong>Communication:</strong> To respond to your inquiries, provide support, and send service-related notices when necessary.</li>
                        <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, legal processes, or enforceable governmental requests.</li>
                    </ul>
                </section>

                <section>
                    <h2>4. Third-Party Service Providers</h2>
                    <p>We use the following third-party services to operate the Platform. These providers may have access to your information only to perform specific tasks on our behalf and are obligated to protect your data under their respective privacy policies:</p>
                    <ul>
                        <li><strong>Google Firebase (Authentication & Firestore):</strong> Used for user authentication (Google Sign-In) and cloud storage of user data (watchlists, viewing history, preferences). Governed by the <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer">Google Firebase Privacy Policy</a>.</li>
                        <li><strong>The Movie Database (TMDB) API:</strong> Used to retrieve movie and TV metadata (titles, descriptions, images, ratings). Governed by the <a href="https://www.themoviedb.org/privacy-policy" target="_blank" rel="noopener noreferrer">TMDB Privacy Policy</a>.</li>
                        <li><strong>Google Gemini AI:</strong> Used to power the AI Taste Matcher recommendation engine. Your taste preferences may be processed by Google's AI services. Governed by the <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a>.</li>
                    </ul>
                    <p>We do not sell, rent, trade, or otherwise share your personal information with third parties for their own marketing purposes.</p>
                </section>

                <section>
                    <h2>5. Data Storage and Retention</h2>
                    <p>Your data is stored on Google Firebase's cloud infrastructure. Firebase employs industry-standard security measures including encryption at rest and in transit.</p>
                    <p>We retain your personal information for as long as your account is active or as needed to provide you with the Services. Specifically:</p>
                    <ul>
                        <li><strong>Account Data:</strong> Retained until you delete your account or request data deletion.</li>
                        <li><strong>Watchlist and Viewing History:</strong> Retained until you manually clear them through the Settings page or delete your account.</li>
                        <li><strong>Preferences and Settings:</strong> Retained in your browser's local storage and can be cleared at any time through the Settings page or your browser settings.</li>
                        <li><strong>Session Data:</strong> Retained temporarily and automatically expires based on Firebase session management policies.</li>
                    </ul>
                </section>

                <section>
                    <h2>6. Data Security</h2>
                    <p>We implement reasonable administrative, technical, and physical security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. These measures include:</p>
                    <ul>
                        <li>Authentication via secure OAuth 2.0 protocols through Google Sign-In.</li>
                        <li>Data transmission over encrypted HTTPS connections.</li>
                        <li>Cloud storage on Google Firebase with built-in security rules and access controls.</li>
                    </ul>
                    <p><strong>However, no method of transmission over the Internet or method of electronic storage is 100% secure.</strong> While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security. You acknowledge and accept this inherent risk when using the Service.</p>
                </section>

                <section>
                    <h2>7. Cookies and Tracking Technologies</h2>
                    <p>The Service uses cookies and similar technologies to enhance your experience. These include:</p>
                    <ul>
                        <li><strong>Essential Cookies:</strong> Required for the Platform to function properly, including authentication tokens and session management.</li>
                        <li><strong>Preference Cookies:</strong> Store your theme, layout, and display preferences for a consistent experience across sessions.</li>
                        <li><strong>Local Storage:</strong> Used to store non-sensitive user preferences and cached data on your device for improved performance.</li>
                    </ul>
                    <p>You can control cookies through your browser settings. Disabling cookies may affect the functionality of certain features of the Service.</p>
                    <p>For more details, please refer to our Cookie Preferences page.</p>
                </section>

                <section>
                    <h2>8. Your Rights</h2>
                    <p>Depending on your jurisdiction, you may have the following rights regarding your personal data:</p>
                    <ul>
                        <li><strong>Right to Access:</strong> You can request a copy of the personal data we hold about you.</li>
                        <li><strong>Right to Rectification:</strong> You can request correction of inaccurate or incomplete data.</li>
                        <li><strong>Right to Deletion:</strong> You can request deletion of your personal data. You may also use the "Data & Import" section of Settings to clear your Watch History and Watchlist at any time.</li>
                        <li><strong>Right to Restriction:</strong> You can request that we restrict the processing of your data under certain circumstances.</li>
                        <li><strong>Right to Data Portability:</strong> You can request your data in a structured, machine-readable format. The "Export Settings" feature in the Settings page allows you to download your preferences.</li>
                        <li><strong>Right to Object:</strong> You can object to the processing of your personal data for specific purposes.</li>
                    </ul>
                    <p>To exercise any of these rights, please contact us through the channels listed in Section 14 of this policy. We will respond to your request within a reasonable timeframe as required by applicable law.</p>
                </section>

                <section>
                    <h2>9. Children's Privacy</h2>
                    <p>The Service is not directed at individuals under the age of 13 ("Children"). We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and you become aware that your child has provided us with personal information, please contact us. If we become aware that we have collected personal information from a child under 13 without verified parental consent, we will take steps to delete that information promptly.</p>
                </section>

                <section>
                    <h2>10. Information Sharing and Disclosure</h2>
                    <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following limited circumstances:</p>
                    <ul>
                        <li><strong>With Your Consent:</strong> We may share information when you explicitly authorize us to do so.</li>
                        <li><strong>Service Providers:</strong> With trusted third-party service providers who assist us in operating the Platform (as described in Section 4), subject to their confidentiality obligations.</li>
                        <li><strong>Legal Requirements:</strong> When required by law, regulation, legal process, subpoena, court order, or governmental request.</li>
                        <li><strong>Protection of Rights:</strong> When we believe in good faith that disclosure is necessary to protect our rights, your safety, or the safety of others; to investigate fraud; or to respond to a government request.</li>
                        <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, reorganization, or sale of assets, your information may be transferred as part of that transaction. We will notify users of any such change in ownership or control.</li>
                    </ul>
                </section>

                <section>
                    <h2>11. International Data Transfers</h2>
                    <p>Your information may be transferred to and maintained on servers located outside of your country of residence. Google Firebase's infrastructure operates globally, and your data may be processed in jurisdictions with different data protection laws than your own.</p>
                    <p>By using the Service, you consent to the transfer of your information to facilities outside your jurisdiction. We will take reasonable steps to ensure that your data is treated securely and in accordance with this Privacy Policy.</p>
                </section>

                <section>
                    <h2>12. Limitation of Liability for Data</h2>
                    <p>While we implement reasonable safeguards to protect your data, the Joe4cast development team shall not be held liable for any unauthorized access, data breaches, or data loss resulting from:</p>
                    <ul>
                        <li>Security vulnerabilities in third-party services (Google Firebase, TMDB, or others).</li>
                        <li>User negligence in protecting account credentials.</li>
                        <li>Circumstances beyond our reasonable control, including but not limited to hacking, cyberattacks, or force majeure events.</li>
                    </ul>
                    <p>Your use of the Service constitutes your acknowledgment and acceptance of these risks.</p>
                </section>

                <section>
                    <h2>13. Changes to This Privacy Policy</h2>
                    <p>We reserve the right to update or modify this Privacy Policy at any time. Changes will be effective immediately upon posting the revised policy on this page with an updated "Last Updated" date.</p>
                    <p>We encourage you to review this Privacy Policy periodically for any changes. Your continued use of the Service after any modifications to this Privacy Policy constitutes your acceptance of such modifications.</p>
                    <p>If we make material changes to this policy that significantly affect how we handle your personal information, we will make reasonable efforts to notify users through the Platform.</p>
                </section>

                <section>
                    <h2>14. Contact Us</h2>
                    <p>If you have any questions, concerns, or requests regarding this Privacy Policy, your personal data, or our data practices, please contact the Joe4cast development team through our official GitHub repository at <a href="https://github.com/ADET-AI-Assistant/Joe4cast" target="_blank" rel="noopener noreferrer">github.com/ADET-AI-Assistant/Joe4cast</a>.</p>
                </section>
            </main>
        </div>
    );
};

export default PrivacyPolicy;
