// quiz.js — client-side logic for the Browsers self-assessment quiz
// This script demonstrates DOM selection, event handling, and basic form processing.

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('browser-quiz');
  const resetBtn = document.getElementById('reset-quiz');
  const summarySection = document.getElementById('quiz-summary');
  const overallEl = document.getElementById('quiz-overall');
  const scoreEl = document.getElementById('quiz-score');

  if (!form) return; // Fail-safe: do nothing if the form is missing.

  form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the default form submission / page reload.

    // Track total questions and score in points.
    const totalQuestions = 5;
    let score = 0;

    // Q1: Short answer (fill-in-the-blank).
    const q1Input = document.getElementById('q1');
    const q1Feedback = document.getElementById('q1-feedback');
    const q1UserAnswer = (q1Input.value || '').trim().toLowerCase();
    const q1Correct = ['gecko']; // Primary engine name used by Firefox.

    if (q1Correct.includes(q1UserAnswer)) {
      score++;
      setFeedback(q1Feedback, 'Correct! Firefox uses the Gecko engine.', true);
    } else {
      setFeedback(q1Feedback, 'Not quite. The browser engine used by Firefox is <strong>Gecko</strong>.', false);
    }

    // Q2: Single-choice radio.
    const q2Feedback = document.getElementById('q2-feedback');
    const q2Value = getCheckedValue('q2');
    if (q2Value === 'b') {
      score++;
      setFeedback(q2Feedback, 'Correct. The engine parses HTML/CSS/JS and paints the page.', true);
    } else {
      setFeedback(
        q2Feedback,
        'Incorrect. A browser engine parses HTML/CSS/JS and turns them into pixels on the screen.',
        false
      );
    }

    // Q3: Single-choice radio.
    const q3Feedback = document.getElementById('q3-feedback');
    const q3Value = getCheckedValue('q3');
    if (q3Value === 'b') {
      score++;
      setFeedback(q3Feedback, 'Correct. Google is the primary maintainer of Blink.', true);
    } else {
      setFeedback(q3Feedback, 'Incorrect. Blink is primarily developed by <strong>Google</strong>.', false);
    }

    // Q4: Single-choice radio.
    const q4Feedback = document.getElementById('q4-feedback');
    const q4Value = getCheckedValue('q4');
    if (q4Value === 'b') {
      score++;
      setFeedback(
        q4Feedback,
        'Correct. Engine monoculture can concentrate power and reduce healthy competition.',
        true
      );
    } else {
      setFeedback(
        q4Feedback,
        'Incorrect. The concern is that a single dominant engine can reduce competition and diversity.',
        false
      );
    }

    // Q5: Multi-select checkboxes.
    const q5Feedback = document.getElementById('q5-feedback');
    const q5CheckedValues = getCheckedValues('q5');
    const q5CorrectSet = new Set(['offline', 'push', 'homescreen']);
    const q5UserSet = new Set(q5CheckedValues);

    const isQ5Correct =
      q5CorrectSet.size === q5UserSet.size &&
      [...q5CorrectSet].every((value) => q5UserSet.has(value));

    if (isQ5Correct) {
      score++;
      setFeedback(
        q5Feedback,
        'Correct. PWAs typically offer offline support, push notifications, and installable icons.',
        true
      );
    } else {
      setFeedback(
        q5Feedback,
        'Partially correct. PWAs are known for <strong>offline support</strong>, <strong>push notifications</strong>, and <strong>installable icons</strong>—but not direct kernel access.',
        false
      );
    }

    // Show aggregated result.
    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = percentage >= 70; // Passing threshold: 70%

    overallEl.textContent = passed
      ? 'Pass — Great job! You have a solid grasp of the key ideas.'
      : 'Not yet — Review the content pages and try again.';

    overallEl.className = 'quiz-overall ' + (passed ? 'quiz-pass' : 'quiz-fail');

    scoreEl.innerHTML = `You scored <span class="score-badge">${score} / ${totalQuestions}</span> (${percentage}%).`;

    summarySection.hidden = false;
    summarySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Reset button clears all user inputs and results on the page.
  resetBtn.addEventListener('click', () => {
    form.reset();

    // Clear feedback text and styling.
    document.querySelectorAll('.quiz-feedback').forEach((el) => {
      el.textContent = '';
      el.classList.remove('correct', 'incorrect');
    });

    overallEl.textContent = '';
    overallEl.className = 'quiz-overall';
    scoreEl.textContent = '';
    summarySection.hidden = true;

    // Move focus back to the first question for accessibility.
    const firstInput = document.getElementById('q1');
    if (firstInput) firstInput.focus();
  });
});

// Helper: get the value of the selected radio input for a group.
function getCheckedValue(name) {
  const selected = document.querySelector(`input[name="${name}"]:checked`);
  return selected ? selected.value : null;
}

// Helper: get all checked values for a set of checkboxes with the same name.
function getCheckedValues(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(
    (el) => el.value
  );
}

// Helper: update a feedback element with text and success/error styling.
function setFeedback(element, message, isCorrect) {
  element.innerHTML = message;
  element.classList.remove('correct', 'incorrect');
  element.classList.add(isCorrect ? 'correct' : 'incorrect');
}
