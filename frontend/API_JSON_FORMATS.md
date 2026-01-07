# JSON Formats - Presentation Studio API

This document describes the JSON formats sent from the frontend to the backend APIs.

---

## 1. POST `/api/presentation/outline`

### Request Body (Sent from PresentationStudio.jsx)

```json
{
  "topic": "Introduction to Machine Learning",
  "tone": "Professional",
  "length": "5",
  "mediaStyle": "AI Images",
  "useBrandStyle": false,
  "outlineText": "Optional outline text if provided by user"
}
```

### Field Descriptions:
- **topic** (string, required): The presentation topic/subject
- **tone** (string): One of: `"Professional"`, `"Friendly"`, `"Minimal"`, `"Corporate"`, `"Creative"`
- **length** (string): One of: `"2"`, `"3"`, `"5"`, `"7"`, `"10"` (number of slides)
- **mediaStyle** (string): One of: `"AI Images"`, `"No Media"`
- **useBrandStyle** (boolean): Whether to use brand styling
- **outlineText** (string, optional): User-provided outline text

### Expected Response Format (from backend)

```json
{
  "topic": "Introduction to Machine Learning",
  "tone": "Professional",
  "length": "5",
  "mediaStyle": "AI Images",
  "slides": [
    {
      "slideId": "slide-1",
      "source": "ai",
      "title": "Introduction to Machine Learning",
      "content": {
        "mode": "raw",
        "rawText": "Machine Learning is a subset of artificial intelligence..."
      }
    },
    {
      "slideId": "slide-2",
      "source": "ai",
      "title": "Key Concepts",
      "content": {
        "mode": "raw",
        "rawText": "Key concepts include:\n• Supervised Learning\n• Unsupervised Learning\n• Reinforcement Learning"
      }
    }
    // ... more slides
  ]
}
```

### Response Field Descriptions:
- **topic** (string): The presentation topic
- **tone** (string): The selected tone
- **length** (string): The selected length
- **mediaStyle** (string): The selected media style
- **slides** (array): Array of slide objects
  - **slideId** (string): Unique identifier for the slide
  - **source** (string): `"ai"` for AI-generated, `"user"` for user-added
  - **title** (string): Slide title
  - **content** (object): Content object with:
    - **mode** (string): `"raw"` for raw text, `"bullets"` for bullet points
    - **rawText** (string): The content text (when mode is "raw")
    - **bullets** (array, optional): Array of bullet points (when mode is "bullets")

---

## 2. POST `/api/presentation/finalize`

### Request Body (Sent from OutlineEditor.jsx)

This is the **updated outline JSON** after user edits:

```json
{
  "topic": "Introduction to Machine Learning",
  "tone": "Professional",
  "length": "5",
  "mediaStyle": "AI Images",
  "slides": [
    {
      "slideId": "slide-1",
      "source": "ai",
      "title": "Introduction to Machine Learning",
      "content": {
        "mode": "raw",
        "rawText": "Machine Learning is a subset of artificial intelligence that enables systems to learn from data."
      }
    },
    {
      "slideId": "slide-2",
      "source": "user",
      "title": "Custom Slide Added by User",
      "content": {
        "mode": "raw",
        "rawText": "This slide was added by the user in the outline editor."
      }
    }
    // ... more slides (may include user-edited titles and content)
  ]
}
```

### Field Descriptions:
- Same structure as outline response, but with **user edits** applied
- Slides may have been:
  - **Edited**: Title or content changed
  - **Added**: New slides with `"source": "user"`
  - **Deleted**: Removed from the array

### Expected Response Format (from backend)

```json
{
  "layout": {
    "width": 1920,
    "height": 1080
  },
  "theme": {
    "backgroundColor": "#ffffff",
    "textColor": "#000000",
    "accentColor": "#3b82f6",
    "font": "Arial"
  },
  "slides": [
    {
      "id": "slide-1",
      "name": "Introduction to Machine Learning",
      "background": "#ffffff",
      "layers": [
        {
          "id": "layer-title-0",
          "type": "text",
          "name": "Title",
          "text": "Introduction to Machine Learning",
          "x": 100,
          "y": 100,
          "fontSize": 48,
          "fontWeight": "bold",
          "color": "#000000",
          "width": 800,
          "height": 100
        },
        {
          "id": "layer-content-0",
          "type": "text",
          "name": "Content",
          "text": "Machine Learning is a subset of artificial intelligence...",
          "x": 100,
          "y": 250,
          "fontSize": 24,
          "fontWeight": "normal",
          "color": "#333333",
          "width": 800,
          "height": 400
        }
        // ... more layers (images, shapes, etc.)
      ],
      "animationDuration": 5
    }
    // ... more slides
  ]
}
```

### Response Field Descriptions:
- **layout** (object): Canvas dimensions
  - **width** (number): Width in pixels
  - **height** (number): Height in pixels
- **theme** (object): Presentation theme
  - **backgroundColor** (string): Background color (hex)
  - **textColor** (string): Text color (hex)
  - **accentColor** (string): Accent color (hex)
  - **font** (string): Font family name
- **slides** (array): Array of fully rendered slide objects
  - **id** (string): Unique slide identifier
  - **name** (string): Slide name/title
  - **background** (string): Background color (hex)
  - **layers** (array): Array of layer objects (text, images, shapes, etc.)
    - **id** (string): Unique layer identifier
    - **type** (string): Layer type (`"text"`, `"image"`, `"shape"`, etc.)
    - **name** (string): Layer name
    - Additional properties depend on layer type
  - **animationDuration** (number): Slide duration in seconds

---

## Example Flow

### Step 1: User fills form and clicks "Generate Outline"
**Request to `/api/presentation/outline`:**
```json
{
  "topic": "AI in Healthcare",
  "tone": "Professional",
  "length": "5",
  "mediaStyle": "AI Images",
  "useBrandStyle": false,
  "outlineText": ""
}
```

**Response from `/api/presentation/outline`:**
```json
{
  "topic": "AI in Healthcare",
  "tone": "Professional",
  "length": "5",
  "mediaStyle": "AI Images",
  "slides": [
    {
      "slideId": "slide-1",
      "source": "ai",
      "title": "AI in Healthcare: An Overview",
      "content": {
        "mode": "raw",
        "rawText": "Artificial Intelligence is transforming healthcare..."
      }
    },
    {
      "slideId": "slide-2",
      "source": "ai",
      "title": "Key Applications",
      "content": {
        "mode": "raw",
        "rawText": "Key applications include:\n• Medical imaging\n• Drug discovery\n• Patient monitoring"
      }
    }
    // ... 3 more slides
  ]
}
```

### Step 2: User edits outline and clicks "Generate Final Presentation"
**Request to `/api/presentation/finalize`:**
```json
{
  "topic": "AI in Healthcare",
  "tone": "Professional",
  "length": "5",
  "mediaStyle": "AI Images",
  "slides": [
    {
      "slideId": "slide-1",
      "source": "ai",
      "title": "AI in Healthcare: An Overview (EDITED)",
      "content": {
        "mode": "raw",
        "rawText": "Artificial Intelligence is revolutionizing healthcare with innovative solutions..."
      }
    },
    {
      "slideId": "slide-2",
      "source": "ai",
      "title": "Key Applications",
      "content": {
        "mode": "raw",
        "rawText": "Key applications include:\n• Medical imaging\n• Drug discovery\n• Patient monitoring"
      }
    },
    {
      "slideId": "slide-6",
      "source": "user",
      "title": "Future Prospects",
      "content": {
        "mode": "raw",
        "rawText": "The future of AI in healthcare looks promising..."
      }
    }
    // ... more slides
  ]
}
```

**Response from `/api/presentation/finalize`:**
```json
{
  "layout": { "width": 1920, "height": 1080 },
  "theme": {
    "backgroundColor": "#ffffff",
    "textColor": "#000000",
    "accentColor": "#3b82f6",
    "font": "Arial"
  },
  "slides": [
    {
      "id": "slide-1",
      "name": "AI in Healthcare: An Overview (EDITED)",
      "background": "#ffffff",
      "layers": [
        // ... fully rendered layers with text, images, etc.
      ],
      "animationDuration": 5
    }
    // ... more slides
  ]
}
```

---

## Notes

1. **Content Mode**: The `content` object can have:
   - `mode: "raw"` with `rawText` property
   - `mode: "bullets"` with `bullets` array property

2. **Slide Source**: 
   - `"ai"` = Generated by AI
   - `"user"` = Added/edited by user

3. **User Edits**: In the finalize request, slides may have:
   - Modified titles
   - Modified content
   - New slides added (with `source: "user"`)
   - Some slides removed (not included in the array)

4. **Final Presentation**: The finalize response should contain fully rendered slides with all layers, ready for the PresentationWorkspace component.

