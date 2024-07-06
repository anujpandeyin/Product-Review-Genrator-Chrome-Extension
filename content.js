// Function to get the product name and fill the review field
async function fillReviewField() {
    const productNameElement = document.querySelector("h1.product_title.entry-title");
    const reviewTextArea = document.querySelector(".woocommerce #review_form #respond textarea");
  
    if (productNameElement && reviewTextArea) {
      const productName = productNameElement.textContent;
      // Call Gemini API to get the review content based on product name
      const reviewContent = await fetchReviewFromGeminiAPI(productName);
      if (reviewContent) {
        reviewTextArea.value = reviewContent;
      }
    }
  }
  
  // Function to fetch review from Gemini API
  async function fetchReviewFromGeminiAPI(productName) {
    const apiKey = "AIzaSyDof_rtXZ1jRdoOwFk1KnMLDfaPWTg7yaA";
    const prompt = `Give me a positive customer review for product name "${productName}". Review should be in inverted commas. Don't include any other info. It should be only one paragraph.`;
  
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                { text: prompt }
              ]
            }
          ]
        })
      });
  
      if (!response.ok) {
        console.error("Error fetching review from Gemini API:", response.statusText);
        return "";
      }
  
      const data = await response.json();
      console.log("API response:", data); // Log the response for debugging
  
      // Ensure the structure is as expected before accessing properties
      if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
        return data.candidates[0].content.parts[0].text || "";
      } else {
        console.error("Unexpected response structure:", data);
        return "";
      }
    } catch (error) {
      console.error("Error fetching review from Gemini API:", error);
      return "";
    }
  }
  
  // Listen for page load
  window.addEventListener("load", fillReviewField);
  