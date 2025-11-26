
export const getTemplateHtml = (data, templateName = 'combination') => {
    const { name, email, phone, summary, skills, experiences, education, projects, certifications } = data;

    // Common styles
    const baseStyles = `
        body { font-family: 'Helvetica', 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 40px; }
        h1 { margin: 0 0 10px 0; font-size: 28px; text-transform: uppercase; }
        h2 { font-size: 18px; text-transform: uppercase; border-bottom: 2px solid #333; padding-bottom: 5px; margin-top: 25px; margin-bottom: 15px; }
        h3 { font-size: 16px; margin: 0 0 5px 0; font-weight: bold; }
        p { margin: 0 0 10px 0; font-size: 14px; }
        ul { margin: 0 0 10px 0; padding-left: 20px; }
        li { margin-bottom: 5px; font-size: 14px; }
        .header { text-align: center; margin-bottom: 30px; }
        .contact-info { font-size: 14px; margin-bottom: 20px; text-align: center; }
        .section { margin-bottom: 20px; }
        .meta { font-style: italic; color: #666; font-size: 14px; margin-bottom: 5px; }
        .row { display: flex; justify-content: space-between; }
    `;

    const atsStyles = `
        body { font-family: 'Courier New', Courier, monospace; line-height: 1.4; color: #000; padding: 20px; }
        h1 { font-size: 24px; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 10px; text-align: center; }
        h2 { font-size: 16px; text-transform: uppercase; margin-top: 20px; margin-bottom: 10px; font-weight: bold; text-decoration: underline; }
        .header { text-align: center; margin-bottom: 20px; }
        .contact-info { text-align: center; margin-bottom: 20px; }
        ul { list-style-type: square; }
    `;

    const modernStyles = `
        h1 { color: #2c3e50; }
        h2 { color: #2980b9; border-bottom: 2px solid #2980b9; }
        .header { text-align: left; border-bottom: 4px solid #2c3e50; padding-bottom: 20px; }
        .contact-info { text-align: left; }
    `;

    let styles = baseStyles;
    if (templateName === 'ats') styles = atsStyles;
    if (templateName === 'combination' || templateName === 'functional') styles += modernStyles;

    // Helper to render sections
    const renderHeader = () => `
        <div class="header">
            <h1>${name || 'Your Name'}</h1>
            <div class="contact-info">
                ${email || ''} | ${phone || ''}
            </div>
        </div>
    `;

    const renderSummary = () => summary ? `
        <div class="section">
            <h2>Professional Summary</h2>
            <p>${summary}</p>
        </div>
    ` : '';

    const renderSkills = () => {
        if (!skills || skills.length === 0) return '';
        // Limit to 24 skills for ATS/cleanliness
        const displaySkills = skills.slice(0, 24);
        return `
        <div class="section">
            <h2>Skills</h2>
            <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                ${displaySkills.map(s => `<span style="${templateName === 'ats' ? '' : 'background: #f0f0f0; padding: 2px 8px; border-radius: 4px;'}">${s}</span>`).join(templateName === 'ats' ? ', ' : '')}
            </div>
        </div>
        `;
    };

    const renderExperience = () => {
        if (!experiences || experiences.length === 0) return '';
        return `
        <div class="section">
            <h2>Professional Experience</h2>
            ${experiences.map(exp => `
                <div style="margin-bottom: 15px;">
                    <div class="row">
                        <h3>${exp.title}</h3>
                        <span class="meta">${exp.from} – ${exp.to}</span>
                    </div>
                    <div class="meta">${exp.company}</div>
                    <ul>
                        ${Array.isArray(exp.desc)
                ? exp.desc.map(d => `<li>${d}</li>`).join('')
                : `<li>${exp.desc}</li>`
            }
                    </ul>
                </div>
            `).join('')}
        </div>
        `;
    };

    const renderEducation = () => {
        if (!education || education.length === 0) return '';
        return `
        <div class="section">
            <h2>Education</h2>
            ${education.map(edu => `
                <div style="margin-bottom: 10px;">
                    <div class="row">
                        <h3>${edu.school}</h3>
                        <span class="meta">${edu.year}</span>
                    </div>
                    <div>${edu.degree}</div>
                </div>
            `).join('')}
        </div>
        `;
    };

    // Template specific ordering
    let content = '';

    if (templateName === 'chronological') {
        content = `
            ${renderHeader()}
            ${renderSummary()}
            ${renderExperience()}
            ${renderEducation()}
            ${renderSkills()}
        `;
    } else if (templateName === 'functional') {
        content = `
            ${renderHeader()}
            ${renderSummary()}
            ${renderSkills()}
            ${renderEducation()}
            ${renderExperience()} 
        `;
    } else if (templateName === 'ats') {
        content = `
            ${renderHeader()}
            ${renderSummary()}
            ${renderSkills()}
            ${renderExperience()}
            ${renderEducation()}
        `;
    } else {
        // Combination (Default)
        content = `
            ${renderHeader()}
            ${renderSummary()}
            ${renderSkills()}
            ${renderExperience()}
            ${renderEducation()}
        `;
    }

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>${styles}</style>
        </head>
        <body>
            ${content}
        </body>
        </html>
    `;
};
