# **App Name**: CampusFlow AI

## Core Features:

- Smart Time Slot Detection: Detect free time slots based on timetable inputs and marked cancellations, determining duration and location (hostel/library/campus).
- AI Productivity Recommendation Engine: Generate context-aware suggestions for productivity based on free slot duration, academic weakness, hostel conditions, and student's past behavior using Gemini API; includes categories for study, coding, study groups, and mental refresh. When generating AI suggestions, be supportive, not strict. Focus on actionable, short tasks. Avoid generic advice. Use student-friendly language.
- Hostel Life Intelligence: Recommend optimal laundry times, adjust study suggestions based on noise levels, and provide simple nutrition feedback using manual inputs for laundry crowd level, mess menu, and noise level. The tool makes a judgment call as to the accuracy of inputs.
- Academic Risk Predictor: Calculate academic risk score based on attendance, assignment delays, productivity score, and self-reported stress levels. Explain the reasons for the risk and suggest preventive actions using Gemini API.
- Productivity Scoring System: Track completed AI-suggested tasks to generate a daily productivity score and weekly trend.
- User Authentication: Enable user authentication via email or anonymous login using Firebase Authentication.
- Data Storage: Use Firestore to store user profiles, timetable data, tasks, and productivity logs.

## Style Guidelines:

- Primary color: Deep violet (#673AB7), symbolizing intellect and focus.
- Background color: Light lavender (#EDE7F6), providing a calm and neutral backdrop.
- Accent color: Bright green (#8BC34A), for positive actions, productivity tracking, and highlights.
- Headline font: 'Space Grotesk' sans-serif; body font: 'Inter' sans-serif. 'Space Grotesk' will be used for headlines to impart a techy, scientific feel, while 'Inter' will be used for the main text, due to its neutral and modern aesthetic.
- Code font: 'Source Code Pro' for displaying any code snippets.
- Use minimalist icons to represent different categories and actions, ensuring clarity and visual appeal.
- Dashboard-style home screen for quick access to key information and features, emphasizing a clean and minimal design.
- Subtle animations to provide feedback on user interactions and improve overall user experience, such as loading indicators and transitions.