console.log("Suggestions JS loaded!");

document.addEventListener("DOMContentLoaded", () => {

    // Get the existing NFL answer input
    const input = document.getElementById("answerInput");

    if (!input) return;

    // Read the athlete dataset from index.html
    // No JSON fetch or API request needed
    const playerNames = athletes.map(player => player.name);

    // Create suggestion box
    const suggestionBox = document.createElement("div");
    suggestionBox.classList.add("suggestion-box");

    // Place input and suggestions inside a wrapper
    const wrapper = document.createElement("div");
    wrapper.classList.add("suggestion-wrapper");

    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);
    wrapper.appendChild(suggestionBox);

    let activeIndex = -1;

    function hideSuggestions() {
        suggestionBox.style.display = "none";
        activeIndex = -1;
    }

    function selectSuggestion(name) {
        input.value = name;
        hideSuggestions();
        input.focus();
    }

    function updateSuggestions() {

        const inputValue = input.value.toLowerCase().trim();

        suggestionBox.innerHTML = "";
        activeIndex = -1;

        if (inputValue.length === 0) {
            hideSuggestions();
            return;
        }

        // Match beginning of first name OR last name
        const matches = playerNames.filter(name => {

            const nameParts = name.toLowerCase().split(/\s+/);

            return nameParts.some(part =>
                part.startsWith(inputValue)
            );

        }).sort((a, b) => a.localeCompare(b));

        if (matches.length === 0) {
            hideSuggestions();
            return;
        }

        // Limit suggestions to 8 results
        matches.slice(0, 8).forEach(name => {

            const suggestion = document.createElement("div");

            suggestion.textContent = name;
            suggestion.classList.add("suggestion");

            // mousedown fires before the input loses focus
            suggestion.addEventListener("mousedown", event => {
                event.preventDefault();
                selectSuggestion(name);
            });

            suggestionBox.appendChild(suggestion);

        });

        suggestionBox.style.display = "block";
    }

    // Show suggestions while typing
    input.addEventListener("input", updateSuggestions);

    // Show suggestions when returning to input
    input.addEventListener("focus", () => {
        if (input.value.trim().length > 0) {
            updateSuggestions();
        }
    });

    // Keyboard navigation
    input.addEventListener("keydown", event => {

        const suggestions =
            suggestionBox.querySelectorAll(".suggestion");

        if (suggestionBox.style.display !== "block") return;

        if (event.key === "ArrowDown") {
            event.preventDefault();

            activeIndex =
                (activeIndex + 1) % suggestions.length;
        }

        else if (event.key === "ArrowUp") {
            event.preventDefault();

            activeIndex =
                (activeIndex - 1 + suggestions.length)
                % suggestions.length;
        }

        else if (event.key === "Enter" && activeIndex >= 0) {
            event.preventDefault();
            event.stopImmediatePropagation();

            selectSuggestion(
                suggestions[activeIndex].textContent
            );

            return;
        }

        else if (event.key === "Escape") {
            hideSuggestions();
            return;
        }

        suggestions.forEach((suggestion, index) => {
            suggestion.classList.toggle(
                "active",
                index === activeIndex
            );
        });

        if (activeIndex >= 0) {
            suggestions[activeIndex].scrollIntoView({
                block: "nearest"
            });
        }

    });

    // Hide suggestions when leaving the input
    input.addEventListener("blur", () => {
        setTimeout(hideSuggestions, 150);
    });

    // Hide suggestions after submitting an answer
    document.getElementById("submitAnswer")
        ?.addEventListener("click", hideSuggestions);

});
