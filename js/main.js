const projects = {
    'task-manager': {
        category: 'Web application',
        title: 'Task Manager',
        description:
            'A focused tool for organizing school assignments and everyday tasks.',
        video: 'videos/task-manager.mp4',
        tags: ['HTML', 'CSS', 'JavaScript']
    },

    'weather-app': {
        category: 'API project',
        title: 'Weather App',
        description:
            'A quiet interface for turning live weather data into something easy to understand.',
        video: 'videos/weather-app.mp4',
        tags: ['HTML', 'CSS', 'JavaScript', 'API']
    },

    'school-library': {
        category: 'Management system',
        title: 'School Library',
        description:
            'A small system for managing books, borrowers, and availability.',
        video: 'videos/school-library.mp4',
        tags: ['HTML', 'CSS', 'JavaScript', 'SQL']
    }
};

const modal = document.querySelector('.project-modal');
const modalClose = document.querySelector('.modal-close');
const modalBackdrop = document.querySelector('.modal-backdrop');
const modalVideo = document.querySelector('#modal-video');
const modalVideoSource = document.querySelector('#modal-video-source');
const modalCategory = document.querySelector('#modal-category');
const modalTitle = document.querySelector('#modal-title');
const modalDescription = document.querySelector('#modal-description');
const modalTags = document.querySelector('#modal-tags');
const projectButtons = document.querySelectorAll('.project-button');

function openProject(projectId) {
    const project = projects[projectId];

    if (!project) {
        return;
    }

    modalCategory.textContent = project.category;
    modalTitle.textContent = project.title;
    modalDescription.textContent = project.description;

    modalTags.innerHTML = project.tags
        .map((tag) => `<span>${tag}</span>`)
        .join('');

    modalVideoSource.src = project.video;
    modalVideo.load();

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    modalClose.focus();
}

function closeProject() {
    modalVideo.pause();
    modalVideo.currentTime = 0;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
}

projectButtons.forEach((button) => {
    button.addEventListener('click', () => {
        openProject(button.dataset.project);
    });
});

modalClose.addEventListener('click', closeProject);
modalBackdrop.addEventListener('click', closeProject);

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) {
        closeProject();
    }
});