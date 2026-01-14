# Product Requirements Document: eMaat 2.0

**Author:** World-Class Senior Frontend Engineer
**Version:** 5.0
**Date:** Current Date

---

## 1. Overview

**eMaat 2.0** is a gamified, AI-powered personal lifestyle application designed to make building a healthier lifestyle fun, engaging, and deeply personal. Users log "life steps," track health measurements, complete lifestyle surveys, and participate in guided multi-day challenges across various lifestyle pillars (e.g., sleep, exercise, nutrition, smoking cessation). Each action earns points, improves a "happiness" meter, and contributes to leveling up.

The core of the experience is a dynamic, personal avatar—an "eMaat"—that visually evolves and thrives as the user makes progress. The app is deeply integrated with the Google Gemini API to provide hyper-personalized educational content, generate creative memory prompts, power a unique avatar evolution feature, conduct guided lifestyle programs, and create an engaging, interactive journey towards better well-being.

## 2. Goals and Objectives

### 2.1. Product Goals
- **Increase User Engagement:** To motivate users to consistently engage with and track healthy habits, measurements, and lifestyle goals through a playful, rewarding, and non-judgmental interface.
- **Promote Holistic Lifestyle:** To encourage a balanced approach to health by focusing on multiple lifestyle pillars, including physical activity, nutrition, sleep, mental health, smoking cessation, and proactive health monitoring.
- **Educate and Empower:** To provide users with accessible, personalized, and actionable health education ("Braintainment") that reinforces their positive actions and improves health literacy.

### 2.2. Business Goals
- **Create a "Sticky" Experience:** Foster long-term user retention by creating a compelling and evolving journey centered around the user's personal avatar, life story, and measurable progress.
- **Demonstrate Advanced AI Capabilities:** Showcase the power of multimodal AI (text, image, audio) to create a truly dynamic and personalized user experience that goes beyond simple data tracking.

## 3. Target Audience

The primary target audience is individuals aged 25-55 who are looking for a gentle, positive, and motivating way to build and maintain healthy habits. They are likely:
- Familiar with mobile applications and digital services.
- Motivated by visual progress, gamification (points, levels, badges), and personalization.
- Potentially overwhelmed by traditional, data-heavy fitness and health apps.
- Seeking a companion app that focuses on overall well-being, incorporating mental health and self-assessment alongside physical activity.

## 4. Epics, Features, and User Stories

---

### **Epic 1: Onboarding & Personalization**
This epic covers the entire first-time user experience, from language selection to the creation of their unique eMaat avatar, establishing a personal connection from the outset.

#### **Feature 1.1: Multi-Step Guided Onboarding**
- **Description:** A guided, multi-screen process that introduces the app and collects user information in a structured, friendly manner.
- **User Story 1.1.1:** As a new user, I want to be prompted to select my preferred language (English, Dutch, or Turkish) as the first step, with the app defaulting to my browser's language.
- **User Story 1.1.2:** As a new user, I want to see an introductory screen that explains the purpose of eMaat and asks me to enter a unique access code from my caregiver, with a 'demo' option available for exploration.
- **User Story 1.1.3:** As a new user, I want to enter my profile information, including name, gender (optional), date of birth (optional, for age calculation), and email address (optional).

#### **Feature 1.2: Initial Health Metrics & Avatar Generation**
- **Description:** The onboarding process captures the user's first health data points (weight and height) and uses a live photo to generate a personalized avatar via the Gemini API.
- **User Story 1.2.1:** As a new user, I want to be asked for my current weight and height during setup, so the app can record my first measurement and calculate my initial BMI.
- **User Story 1.2.2:** As a new user, I want to take a photo of myself using my device's camera so that the app can create a unique cartoon avatar for me, making the experience feel personal and fun.
- **User Story 1.2.3:** As a new user, I want to be able to switch between my device's front and back cameras to take the best possible photo.

#### **Feature 1.3: Permission & Preference Settings**
- **Description:** During onboarding, users can opt-in to key features that enhance the experience.
- **User Story 1.3.1:** As a new user, I want to choose whether to enable audio tips so that I can control how I receive information.
- **User Story 1.3.2:** As a new user, I want to choose whether to enable visual avatar updates so that I can decide if my avatar should change with my progress.

---

### **Epic 2: Core Gamification Loop (Logging a "Life Step")**
This epic details the central user flow for logging healthy habits, where interaction, gamification, and AI come together to create a rewarding experience.

#### **Feature 2.1: Activity Logging & FAB Menu**
- **Description:** A floating action button (FAB) provides quick access to log activities, measurements, and surveys. The menu is context-aware.
- **User Story 2.1.1:** As a user, I want to tap a prominent plus (+) button to open a menu of logging options, making it easy to record my actions from anywhere in the main app.
- **User Story 2.1.2:** As a user in the "Quit Smoking Challenge," I want to see a special "Log Cigarette" option in the menu.
- **User Story 2.1.3:** As a user with an active journal, I want a "Log Journal Entry" option in the menu for quick access.

#### **Feature 2.2: Memory Creation & Detail Logging**
- **Description:** Before completing the log, users are prompted to document their activity with details, photos, text, or voice notes.
- **User Story 2.2.1:** As a user logging an activity, I want to first be taken to a memory screen where I can receive an AI-generated prompt to inspire my reflection.
- **User Story 2.2.2:** As a user, I want to add a photo from my camera, a typed text note, or a dictated voice note to my activity log.
- **User Story 2.2.3:** As a user, I want to log specific details about my activity (e.g., duration of sleep, steps walked, description of a meal).
- **User Story 2.2.4:** As a user, I want to mark my memory as "private" so that it's visually distinguished on my timeline.

#### **Feature 2.3: AI-Powered Braintainment & Rewards**
- **Description:** After logging, the app provides a multi-layered, AI-powered reinforcement experience.
- **User Story 2.3.1:** As a user, I sometimes want to answer a quiz question based on a past tip so that I can earn bonus points and reinforce my learning.
- **User Story 2.3.2:** As a user, I want to receive a hyper-personalized, encouraging health tip ("Braintainment Nudge") after logging an activity.
- **User Story 2.3.3:** As a user with audio enabled, I want to hear the tip spoken aloud (`gemini-2.5-flash-preview-tts`).

#### **Feature 2.4: Dynamic Avatar Evolution**
- **Description:** The user's avatar is dynamically updated using the Gemini API (`gemini-2.5-flash-image`) to reflect their latest achievement.
- **User Story 2.4.1:** As a user with avatar updates enabled, I want my avatar to visually change based on my activity or by incorporating elements from my memory photo.
- **User Story 2.4.2:** As a user, I want to view a "before and after" comparison of my avatar to see how it evolved.

#### **Feature 2.5: Gamification Mechanics**
- **Description:** A system of points, levels, badges, and streaks to motivate consistent engagement.
- **User Story 2.5.1:** As a user, I want to earn points for each activity I log, with a chance for double points from quizzes, so that I can level up.
- **User Story 2.5.2:** As a user, I want my "happiness" meter to increase with positive actions.
- **User Story 2.5.3:** As a user, I want to earn bronze, silver, and gold badges for reaching point milestones.
- **User Story 2.5.4:** As a user, I want to build a daily streak for logging at least one activity per day.

---

### **Epic 3: The eMaat Experience (Main UI & Navigation)**
This epic defines the primary user interface, structured around a five-tab bottom navigation bar.

#### **Feature 3.1: Timeline View (Home Screen)**
- **Description:** The central feed, providing a chronological overview of the user's journey.
- **User Story 3.1.1:** As a user, I want a central timeline that shows all my logged activities, measurements, survey results, journal entries, and completed challenge activities.
- **User Story 3.1.2:** As a new user, I want to see a welcome card that explains the app's features and suggests a starting challenge, even if I logged my weight during onboarding.
- **User Story 3.1.3:** As a new user, I want to see a card displaying my initial BMI, its category (e.g., Healthy Weight), and tailored advice.
- **User Story 3.1.4:** As a user, I want to see upcoming reminders and scheduled challenge activities at the top of my feed.

#### **Feature 3.2: Plan View**
- **Description:** A centralized hub for managing all personal lifestyle goals and guided challenges.
- **User Story 3.2.1:** As a user, I want a single screen to view all my active goals, my active challenge, and my active journal.
- **User Story 3.2.2:** As a user, I want to be able to start a new guided challenge and receive a confirmation prompt if another challenge is already active.
- **User Story 3.2.3:** As a user, I want to browse and start a new personal goal from a list of available options.

#### **Feature 3.3: Agenda View**
- **Description:** A calendar and schedule view for all upcoming events with interactive capabilities.
- **User Story 3.3.1:** As a user, I want to view my upcoming reminders and scheduled challenge activities in a weekly list or a full monthly calendar.
- **User Story 3.3.2:** As a user, I want to see a visual indicator (e.g., a checkbox) on my agenda to quickly identify which challenge activities are completed.
- **User Story 3.3.3:** As a user, I want to tap a subtle 'schedule' icon next to an upcoming activity on my agenda so that I can easily change its date and time.

#### **Feature 3.4: Stats View**
- **Description:** A comprehensive dashboard with charts and graphs for visualizing progress over time.
- **User Story 3.4.1:** As a user, I want to see bar charts visualizing my challenge progress (e.g., daily steps, sleep quality).
- **User Story 3.4.2:** As a user, I want to see line charts of my logged health measurements over time to identify trends.
- **User Story 3.4.3:** As a user who has completed a survey multiple times, I want to see a line chart showing my scores over time.

#### **Feature 3.5: Settings & Profile View**
- **Description:** The user's profile and application settings hub.
- **User Story 3.5.1:** As a user, I want to edit all my personal information provided during onboarding (name, date of birth, gender, email, height) from the settings screen.
- **User Story 3.5.2:** As a user, I want to view all my earned badges and my progress toward the next unearned badges.
- **User Story 3.5.3:** As a user, I want to manage app settings like language, audio tips, avatar updates, and notification permissions.

---

### **Epic 4: AI Coaching & Conversation**
This epic covers the conversational AI feature, "eMaat Coach," which provides personalized insights, answers questions, and helps users navigate the app using natural language.

#### **Feature 4.1: Conversational Interface**
- **Description:** A chat screen where users can interact with the AI coach.
- **User Story 4.1.1:** As a user, I want to open a chat window to talk to my eMaat coach for support and advice.
- **User Story 4.1.2:** As a user, I want to see AI-generated suggestions for conversation starters when I open the chat.
- **User Story 4.1.3:** As a user, I want to be able to type my questions or use my voice to speak to the coach.

#### **Feature 4.2: Context-Aware Responses**
- **Description:** The AI coach uses a comprehensive summary of the user's app state to provide relevant and personalized answers.
- **User Story 4.2.1:** As a user, when I ask "How did I do this week?", I want the coach to analyze my recent data to give me a meaningful summary.
- **User Story 4.2.2:** As a user, I want the AI to provide contextual follow-up suggestions after it answers.

#### **Feature 4.3: In-Chat Actions (Function Calling)**
- **Description:** The AI coach can perform actions within the app on the user's behalf.
- **User Story 4.3.1:** As a user, if I tell the coach "I want to start the sleep challenge," I want it to initiate the challenge for me.
- **User Story 4.3.2:** As a user, if I say "Help me set a goal for walking," I want the coach to guide me to the goal-setting screen.

---

### **Epic 5: Guided Lifestyle Challenges**
This epic covers the structured, multi-day programs designed to help users build specific healthy habits.

#### **Feature 5.1: Multi-Day Guided Programs**
- **Description:** The app offers six distinct 15-day challenges, each with a unique set of daily activities, tips, and check-ins.
- **User Story 5.1.1:** As a user wanting to improve my sleep, I want to join a **Sleep Challenge** with daily morning check-ins (sleep quality/duration), educational tips, and evening reflections.
- **User Story 5.1.2:** As a user wanting to be more active, I want to join a **Movement Challenge** that prompts me to set a step goal and log my daily movement.
- **User Story 5.1.3:** As a user wanting to eat healthier, I want to join a **Nutrition Challenge** that encourages me to track my meals with photos and provides nutritional tips.
- **User Story 5.1.4:** As a user trying to quit smoking, I want to join a **Quit Smoking Challenge** that provides daily tips and reflective assignments.
- **User Story 5.1.5:** As a user wanting to improve my social confidence, I want to join a **Social Skills Challenge** with daily check-ins about my social energy and reflections on my interactions.
- **User Story 5.1.6:** As a user wanting to manage stress, I want to join a **Stress Challenge** that includes daily breathing exercises and pulse measurements to track progress.

---

### **Epic 6: Health & Lifestyle Tracking**
This epic covers modules for tracking key health metrics and completing structured lifestyle questionnaires for self-assessment.

#### **Feature 6.1: Health Measurement Logging**
- **Description:** Allows users to log 8 different types of health metrics.
- **User Story 6.1.1:** As a user, I want to select from a clear grid of measurement types (e.g., Heart Rate, Blood Pressure, Weight) so that I can easily log my health data.
- **User Story 6.1.2:** As a user logging my blood pressure, I want to see instructions on how to measure it correctly and a lifestyle tip.
- **User Story 6.1.3:** As a user, I want the option to attach a personal memory to a measurement.

#### **Feature 6.2: Lifestyle Survey Assessments**
- **Description:** Provides a library of 11 validated clinical and lifestyle surveys for self-assessment.
- **User Story 6.2.1:** As a user, I want to choose from a library of surveys (e.g., PHQ-9 for depression, GAD-7 for anxiety) to self-assess my well-being.
- **User Story 6.2.2:** As a user, after completing a survey, I want to see a results screen with my scores, a clear interpretation (e.g., "low," "moderate," "high"), and personalized advice.

#### **Feature 6.3: Guided Journals**
- **Description:** A feature allowing users to track specific symptoms or patterns using structured journal templates.
- **User Story 6.3.1:** As a user, I want to be able to start a specific journal (e.g., Symptom Diary, Headache Diary) from my Plan screen.
- **User Story 6.3.2:** As a user with an active journal, I want to be able to quickly log a new entry from the main action button (FAB).
- **User Story 6.3.3:** As a user, I want my journal entries to appear on my timeline.

---

### **Epic 7: Goal Management**
This epic covers the creation and management of personal, non-challenge-related lifestyle goals.

#### **Feature 7.1: Personal Goal Setting**
- **Description:** Users can set specific, measurable goals for a wide range of activities.
- **User Story 7.1.1:** As a user, I want to set a goal for activities like daily walking, strength training, hydration, alcohol intake, or screen-free time from the Plan tab.
- **User Story 7.1.2:** As a user setting a goal, I want to configure specific parameters (e.g., minutes per walk, days per week) and set up reminders.
- **User Story 7.1.3:** As a user, I want to edit or remove my personal goals at any time.

#### **Feature 7.2: Guided Weight Goal Management**
- **Description:** A specialized flow for setting and tracking a weight goal with built-in health guidance.
- **User Story 7.2.1:** As a user, I want to set a weight goal by specifying a target weight and a target date.
- **User Story 7.2.2:** As a user setting a weight goal, I want to be shown clear, science-backed guidelines about healthy rates of weight loss or gain before I confirm my goal.
- **User Story 7.2.3:** As a user with an active weight goal, every time I log my weight, I want to see a progress screen showing my progress, my new BMI, and personalized motivational advice.

---

### **Epic 8: Technical Foundation & Non-Functional Requirements (NFRs)**
This epic outlines the core technologies and quality attributes that underpin the entire application.

#### **Feature 8.1: Progressive Web App (PWA) & Offline Support**
- **Description:** The application is built as a PWA with a Service Worker to enable offline access and fast loading.
- **User Story 8.1.1:** As a user, I want the app to load quickly and be accessible even when my internet connection is poor.

#### **Feature 8.2: Robust Data Persistence & Management**
- **Description:** A dual-storage strategy using `localStorage` for state and `IndexedDB` for large assets, with an option for users to reset their data.
- **User Story 8.2.1:** As a user, I want my progress, avatar, and history to be saved when I close and reopen the app.
- **User Story 8.2.2:** As a user, I want a way to completely reset my application data from the settings screen, after a clear confirmation warning, so that I can start my journey over.

#### **Feature 8.3: Internationalization (i18n)**
- **Description:** The app is fully translated to support English (en), Dutch (nl), and Turkish (tr).
- **User Story 8.3.1:** As a user, I want to use the app in my preferred language so that it is easy for me to understand.

#### **Feature 8.4: Proactive Notifications**
- **Description:** The app uses a service worker to schedule and deliver notifications for upcoming activities.
- **User Story 8.4.1:** As a user, I want to receive reminders for my upcoming activities even when the app tab is closed, so that I don't miss important tasks.

#### **Feature 8.5: Graceful Error Handling**
- **Description:** A global React Error Boundary catches unexpected runtime errors.
- **User Story 8.5.1:** As a user, if the app encounters a critical error, I want it to fail gracefully and allow me to reload without losing my data.
