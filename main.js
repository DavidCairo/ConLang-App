// Make homepage
window.renderHome = function() {
    const app = document.getElementById('app');
    activeLesson = null;
    
    let html = `
        <div class="nav-container">
            <button class="primary-btn" onclick="renderDictionary()">📖 Dictionary</button>
            <button class="primary-btn" onclick="renderReference()">📚 Grammar Tables</button>
        </div>
        <h1>Tvaali Course</h1>
    `;

    courseUnits.forEach(unit => {
        html += `
            <div class="unit-container" style="background-color: ${unit.color}">
                <h2 class="unit-header">${unit.title}</h2>
                <div class="unit-lessons">
        `;

        // Filter allLessons to find the ones belonging to this unit
        const unitLessons = allLessons.filter(l => unit.lessonIds.includes(l.id));

        unitLessons.forEach(lesson => {
            const subLessons = lesson.subLessons || [];
            
            // FIX: Filter progress specifically for this lesson ID
            const lessonCompletions = completedSubLessons.filter(key => key.startsWith(`${lesson.id}-`));
            const doneCount = lessonCompletions.length;
            const totalCount = subLessons.length;

            const progressSegments = subLessons.map((sub, index) => {
                const isDone = completedSubLessons.includes(`${lesson.id}-${index}`);
                const statusClass = isDone ? 'segment-done' : 'segment-pending';
                return `
                    <div class="progress-segment ${statusClass}" 
                         onclick="startSubLesson(${lesson.id}, ${index})"
                         title="${sub.title}">
                        <span class="segment-number">${index + 1}</span>
                    </div>
                `;
            }).join('');

            html += `
                <div class="lesson-card">
                    <button class="info-btn-home" onclick="showInfo(${lesson.id})" title="Lesson Info">ⓘ</button>
                    <h3>Lesson ${lesson.id}: ${lesson.title}</h3>
                    <div class="lesson-progress-container">
                        <div class="progress-bar-line">
                            ${progressSegments}
                        </div>
                        <p class="progress-text">${doneCount} / ${totalCount} Parts Complete</p>
                    </div>
                </div>
            `;
        });

        html += `</div></div>`; // Close unit-lessons and unit-container
    });

    app.innerHTML = html;
}

// Make the dictionary at the homepage
window.updateDictionaryResults = function() {
    const term = document.getElementById('dict-search')?.value.toLowerCase().trim() || "";
    const resultsDiv = document.getElementById('dict-results');
    if (!resultsDiv) return;

    const nounsList = Object.entries(nouns).map(([en, data]) => ({ en, tv: data.root, type: 'noun' }));
    const verbsList = Object.entries(verbs).map(([en, data]) => ({ en, tv: data.stem, type: 'verb' }));
    
    let combined = [...nounsList, ...verbsList].sort((a, b) => 
        isTvToEn ? a.tv.localeCompare(b.tv) : a.en.localeCompare(b.en)
    );

    // If there is a search term, filter it. If NOT, show the whole alphabetical list.
    const filtered = term.length >= 2 
        ? combined.filter(item => isTvToEn ? item.tv.toLowerCase().includes(term) : item.en.toLowerCase().includes(term))
        : combined; // Show all if search is empty

    resultsDiv.innerHTML = filtered.map(item => `
        <div class="modal-vocab-row">
            <div class="vocab-left">
                <span class="en-word">${isTvToEn ? item.tv : item.en}</span>
                <span class="meta-tag tag-${item.type}">${item.type}</span>
            </div>
            <div class="vocab-right">
                <span class="tvaali-text">${isTvToEn ? item.en : item.tv}</span>
            </div>
        </div>
    `).join('');
};

window.renderDictionary = function() {
    const app = document.getElementById('app');
    const getModeText = () => isTvToEn ? "Tvaali ➔ English" : "English ➔ Tvaali";

    app.innerHTML = `
        <div class="nav-container">
            <button class="primary-btn" onclick="renderHome()">⬅ Back</button>
        </div>
        <h1>Dictionary</h1>
        <div class="card sandbox-card">
            <div class="dictionary-controls">
                <input type="text" id="dict-search" 
                       placeholder="Search (2+ letters)..." 
                       oninput="window.updateDictionaryResults()">
                
                <div class="toggle-container">
                    <span class="toggle-label">Mode:</span>
                    <button id="mode-toggle-btn" class="toggle-switch ${isTvToEn ? 'active' : ''}" 
                            onclick="toggleDictMode()">
                        ${getModeText()}
                    </button>
                </div>
            </div>
            <div id="dict-results" class="modal-vocab-list">
                <div class="dictionary-hint">Type at least 2 letters to search...</div>
            </div>
        </div>
    `;
}

// 4. The global toggle function
window.toggleDictMode = function() {
    isTvToEn = !isTvToEn;
    renderDictionary(); // Re-render the container
    window.updateDictionaryResults(); // Refresh list logic
};

window.renderReference = function() {
    const app = document.getElementById('app');
    
    app.innerHTML = `
        <div class="nav-container">
            <button class="primary-btn" onclick="renderHome()">⬅ Back</button>
        </div>
        <h1>Grammar Laboratory</h1>

        <div class="card sandbox-card">
            <h3>Word Builder</h3>
            <div class="sandbox-display-wrapper">
                <div class="sandbox-column">
                    <label>Base Word</label>
                    <select id="test-type" onchange="toggleSandboxFields()">
                        <option value="noun">Noun</option>
                        <option value="verb">Verb</option>
                    </select>
                    
                    <div class="search-wrapper">
                        <input type="text" id="test-input" 
                            placeholder="Search noun or verb..." 
                            oninput="updateNumberOptions(); runSandboxTest(); handleAutocomplete('test-input', 'sandbox-autocomplete-list')" 
                            autocomplete="off">
                        <div id="sandbox-autocomplete-list" class="autocomplete-suggestions"></div>
                    </div>
                </div>

                <div id="noun-fields" class="sandbox-column">
                    <label>Noun Settings</label>
                    <select id="test-case" onchange="runSandboxTest()">
                        <option value="NOM">Nominative</option>
                        <option value="ERG">Ergative</option>
                        <option value="ACC">Accusative</option>
                        <option value="GEN">Genitive</option>
                        <option value="DAT">Dative</option>
                        <option value="LOC">Locative</option>
                        <option value="TRA">Transportative</option>
                        <option value="ALL">Allative</option>
                        <option value="ABL">Ablative</option>
                        <option value="INS">Instrumental</option>
                        <option value="COM">Comitative</option>
                    </select>
                    <select id="test-number" class="dynamic-number-select" onchange="runSandboxTest()">
                        <option value="singular">Singular</option>
                        <option value="dual">Dual</option>
                        <option value="paucal">Paucal</option>
                        <option value="plural">Plural</option>
                    </select>                    
                </div>

                <div id="verb-fields" class="sandbox-column" style="display:none;">
                    <div class="sandbox-sub-grid">
                        <div class="control-group">
                            <label>Subject & Tense</label>
                            <select id="test-person" onchange="runSandboxTest()">
                                <option value="1st inclusive">1st inclusive</option>
                                <option value="1st exclusive">1st exclusive</option>
                                <option value="2nd formal">2nd formal</option>
                                <option value="2nd informal">2nd informal</option>
                                <option value="3rd animate">3rd animate</option>
                                <option value="3rd inanimate">3rd inanimate</option>
                                <option value="3rd abstract">3rd abstract</option>
                                <option value="indef animate">Indefinite Animate</option>
                                <option value="indef inanimate">Indefinite Inanimate</option>
                            </select>
                            <select id="test-verb-number" onchange="runSandboxTest()">
                                <option value="singular">Singular</option>
                                <option value="dual">Dual</option>
                                <option value="paucal">Paucal</option>
                                <option value="plural">Plural</option>
                            </select>
                            <select id="test-tense" onchange="runSandboxTest()">
                                <option value="present perfective">Present Perfective</option>
                                <option value="present habitual">Present Habitual</option>
                                <option value="past perfective">Past Perfective</option>
                                <option value="future perfective">Future</option>
                                <option value="infinitive perfective">Infinitive</option>
                            </select>
                            <select id="test-aspect" onchange="filterTenses()">
                                <option value="perfective">Perfective</option>
                                <option value="continuous">Continuous</option>
                                <option value="habitual">Habitual</option>
                            </select>
                        </div>

                        <div class="control-group">
                            <label>Voice & Valency</label>
                            <div class="checkbox-row">
                                <input type="checkbox" id="test-passive" onchange="runSandboxTest()"> Passive
                            </div>
                            <div class="checkbox-row">
                                <input type="checkbox" id="test-detrans" onchange="runSandboxTest()"> Detransitive
                            </div>
                            <select id="test-applicative" onchange="runSandboxTest()">
                                <option value="">No Applicative</option>
                                <option value="benefactive">Benefactive (dhe)</option>
                                <option value="instrumental">Instrumental (hi)</option>
                                <option value="directive">Directive (ba)</option>
                                <option value="comitative">Comitative (mi)</option>
                                <option value="ablative">Ablative (du)</option>
                            </select>
                        </div>

                        <div class="control-group">
                            <label>Modality & Truth</label>
                            <select id="test-modal" onchange="runSandboxTest()">
                                <option value="indicative">Indicative</option>
                                <option value="speculative">Speculative</option>
                                <option value="abilitive">Abilitive</option>
                                <option value="volitive">Volitive</option>
                                <option value="obligative">Obligative</option>
                            </select>
                            <div class="checkbox-row">
                                <input type="checkbox" id="test-interrogative" onchange="runSandboxTest()"> Interrogative (?)
                            </div>
                            <select id="test-evidential" onchange="runSandboxTest()">
                                <option value="">No Evidential</option>
                                <option value="reportative">Reportative (vigaa)</option>
                                <option value="inferential">Inferential (iwosaa)</option>
                                <option value="dubitative">Dubitative (vigigaa)</option>
                            </select>
                        </div>

                        <div class="control-group">
                            <label>Other Markers</label>
                            <div class="checkbox-row">
                                <input type="checkbox" id="test-causative" onchange="runSandboxTest()"> Causative
                            </div>
                            <div class="checkbox-row">
                                <input type="checkbox" id="test-reflexive" onchange="runSandboxTest()"> Reflexive
                            </div>
                            <div class="checkbox-row">
                                <input type="checkbox" id="test-negated" onchange="runSandboxTest()"> Negated (tai)
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="sandbox-footer">
                <label class="toggle-label">Result:</label>
                <div id="sandbox-result" class="tvaali-text">---</div>
            </div>
        </div>

        <div class="card sandbox-card">
            <h3>Morphology Explorer</h3>
            <p>Type a word to view its full declension table (Nouns) or load into Builder (Verbs).</p>
            <div class="search-wrapper">
                <input type="text" id="ref-search" 
                       oninput="handleAutocomplete('ref-search', 'autocomplete-list')"
                       placeholder="Start typing (e.g., 'tree' or 'sidhi')..." 
                       autocomplete="off">
                <div id="autocomplete-list" class="autocomplete-suggestions"></div>
            </div>
            <div id="ref-display-area"></div>
        </div>

        <div class="card sandbox-card">
            <h3>Affix Reference</h3>
            <div id="loose-tables-area">
                </div>
        </div>
    `;

    // CRITICAL: Initialize the view so the correct fields are shown/hidden immediately
    if (typeof toggleSandboxFields === "function") {
        window.toggleSandboxFields();
    }
}

// Also close if they click outside the white box
window.onclick = function(event) {
    const modal = document.getElementById('infoModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

// Check if a lesson has been shuffled
function renderSortingModule(module) {
    const app = document.getElementById('app');
    
    // 1. Create the combined list if it doesn't exist yet
    if (!module.shuffledList) {
        module.shuffledList = shuffleArray([...module.groups.Animate, ...module.groups.Inanimate]);
    }

    const word = module.shuffledList[currentSubStep];
    const relevantNewWords = module.newWords || activeLesson.newWords || [];
    const wrappedWord = wrapWords(word, true, relevantNewWords);
    
    app.innerHTML = `
        <h1>${module.title}</h1>
        <div class="card">
            <p>${module.description}</p>
            <h2 class="large-tv">${wrappedWord}</h2>
            <div class="sorting-buttons">
                <button class="primary-btn sort-btn" onclick="checkSort('${word}', 'Animate', this)">Animate</button>
                <button class="primary-btn sort-btn" onclick="checkSort('${word}', 'Inanimate', this)">Inanimate</button>
            </div>
            <p id="feedback"></p>
        </div>
    `;
}

// Global enter check
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const nextBtn = document.getElementById('next-btn');
        const submitBtn = document.getElementById('submit-btn');
        
        // 1. If we are on a screen where the answer is already correct (or it's an infoCard)
        if (isCorrect && nextBtn && nextBtn.style.display !== "none") {
            const currentModule = activeLesson.currentSubModules[currentModuleIndex];
            handleModuleProgress(currentModule);
        } 
        // 2. If we are on a question screen and haven't submitted yet
        else if (submitBtn && submitBtn.style.display !== "none") {
            submitBtn.click();
        }
    }
});

renderHome();
