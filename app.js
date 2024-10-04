document.addEventListener('contextmenu', event => event.preventDefault());

setTimeout(() => {
    const splashScreen = document.querySelector('.splash-screen');
    const mainContent = document.querySelector('.container');
    mainContent.style.display = 'flex';
    splashScreen.style.display = 'none';

}, 4000);
window.addEventListener('beforeunload', function (event) {
    event.preventDefault(); // Some browsers may ignore this
});
const list = document.querySelector("ul");
const input = document.querySelector("input");
import { GoogleGenerativeAI } from "@google/generative-ai";
// Replace with your actual API key
const API_KEY = "AIzaSyDF63eJF9nobdpsXQjPLZKOoLnzaQPhEs4";

document.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        
        let i = input.value;
        addItem(i,"user")
        document.querySelector('input').value = ""
        generateText(i)

    }
});

async function generateText(text) {
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const response = await model.generateContent(text);
        let result = response.response.text();
        
        console.log("Generated Text:", result);
        console.log("MODEL Text:", response.response);

        addItem(result.replace(/\n/g, "<br>").replace('**', " ")   ,"com")


    } catch (error) {
        console.error("Error generating text:", error);
    }
}

function addItem(text, who){
    let i = document.createElement('li');
    i.setAttribute("class",who);
    if(who == "com"){
        i.innerHTML = `<!-- COMPUTERS RESPONSE -->
                    <span>
                        ${text}
                    </span>

                    <div class="opts">                    
                        <i id="speak" class="fa-solid fa-volume-high" aria-label="Read aloud"> 
                            <span class="tooltip">Read aloud!</span> 
                        </i>
                        <i id="copy" class="fa-regular fa-copy" aria-label="Copy text">
                            <span class="tooltip">Copy text!</span> 
                        </i>
                        <i id="download" class="fa-solid fa-download" aria-label="Download as text file">  
                            <span class="tooltip">Download as a txt file!</span> 
                        </i>
                    </div>`

    }else {
        i.innerHTML = `<!-- USER'S QUERY -->
                    <span>
                        ${text}
                    </span>`
    }

    list.appendChild(i);
    i.scrollIntoView({behavior: 'smooth'});

    const copyButton = i.querySelector('#copy');
    const readAloudButton = i.querySelector('#speak');
    const downloadButton = i.querySelector('#download');

    if (copyButton) {
        copyButton.addEventListener('click', () => {
            copyToClipboard(text);
        });
    }

    if (readAloudButton) {
        readAloudButton.addEventListener('click', () => {
            if(readAloudButton.getAttribute("class") === "fa-solid fa-stop"){
                window.speechSynthesis.cancel();
                readAloudButton.setAttribute("class","fa-solid fa-volume-high")
            }else {
                readAloud(text);
                readAloudButton.setAttribute("class","fa-solid fa-stop")
            }
            
        });
    }

    if (downloadButton) {
        downloadButton.addEventListener('click', () => {
            downloadTextFile(text);

        });
    }

}

document.querySelector("button").addEventListener("click",() => {

    let i = input.value;
    addItem(i,"user")
    document.querySelector('input').value = ""
    generateText(i)



});

function downloadTextFile(text){
    const blob = new Blob([text.replace(/<br>/g,"\n")], { type: 'text/plain' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'infinitegpt_file.txt';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

}

function readAloud(text){
    // Create a new SpeechSynthesisUtterance instance
    var utterance = new SpeechSynthesisUtterance(text.replace(/<br>/g, "      "));

    // Use the speechSynthesis API to speak the text
    window.speechSynthesis.speak(utterance);
}

function copyToClipboard(text){
    navigator.clipboard.writeText(text.replace(/<br>/g,"   ")).then(() => {

    }).catch((error) => {
      console.error('Could not copy text: ', error);
    });
}
