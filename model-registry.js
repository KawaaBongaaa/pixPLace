/**
 * ═══════════════════════════════════════════════════════════════════════
 * MODEL REGISTRY — Single Source of Truth for all Models & Pricing
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * Every model in the app is defined HERE — name, cost, tabs, premium flag, etc.
 * To add a new model, just add an entry to MODEL_REGISTRY below.
 * It will automatically appear in:
 *   • Access Guard (credit check before generation)
 *   • Credit Purchase Modal (shows correct cost)
 *   • Pricing page "Model Credit Costs" table
 *   • Model selector dropdown (via modes/tags)
 *
 * ⚡ HOW TO ADD A NEW MODEL:
 *   1. Add an object to MODEL_REGISTRY array
 *   2. That's it. Everything else is automatic.
 */

// ─── Registry ────────────────────────────────────────────────────────────────

export const MODEL_REGISTRY = [
    // ═══════════════════════ IMAGE GENERATION ═══════════════════════
    {
        id: 'nano_banana',
        name: 'Nano Banana',
        group: 'Google Gemini',
        section: 'image',
        cost: 3,
        costLabel: '3 credits',
        costUnit: 'image',
        modes: ['image', 'edit'],
        tags: ['txt2img', 'edit'],
        premium: false,
        defaultSize: 'auto',
        webhookKey: 'NANO_BANANA_WEBHOOK',
        iconClass: 'model-icon-gemini',
        maxImages: 4,
        description: 'Ultimate photo editor! Drop up to 4 reference pics and just tell the AI what to change.',
    },
    {
        id: 'nano_banana_2',
        name: 'Nano Banana 2',
        group: 'Google Gemini',
        section: 'image',
        cost: 5,
        costLabel: '5–11 credits',
        costUnit: 'image',
        modes: ['image', 'edit'],
        tags: ['txt2img', 'edit'],
        premium: false,
        defaultSize: 'auto',
        dynamicCost: { '1k': 5, '2k': 7, '4k': 11 },
        webhookKey: 'NANO_BANANA_2_WEBHOOK',
        iconClass: 'model-icon-gemini',
        maxImages: 8,
        description: 'Next-generation Gemini editor with high resolution capabilities.',
    },
    {
        id: 'nano_banana_pro',
        name: 'Nano Banana Pro',
        group: 'Google Gemini',
        section: 'image',
        cost: 12,
        costLabel: '12–16 credits',
        costUnit: 'image',
        modes: ['image', 'edit'],
        tags: ['txt2img', 'edit'],
        premium: true,
        defaultSize: 'auto',
        dynamicCost: { '1k': 12, '2k': 12, '4k': 16 },
        webhookKey: 'NANO_BANANA_PRO_WEBHOOK',
        iconClass: 'model-icon-gemini',
        maxImages: 14,
        description: 'Professional-grade photo editing! Advanced AI with enhanced precision for complex edits.',
    },
    {
        id: 'z_image',
        name: 'Z-Image Turbo',
        group: 'Z-Image',
        section: 'image',
        cost: 3,
        costLabel: '3 credits',
        costUnit: 'image',
        modes: ['image'],
        tags: ['txt2img'],
        premium: false,
        defaultSize: '1024x1024',
        webhookKey: 'Z_IMAGE_WEBHOOK_URL',
        iconClass: 'model-icon-zimage',
        maxImages: 1,
        description: 'Fast and creative image generation using the Z-Image model.',
    },
    {
        id: 'qwen_image',
        name: 'Qwen Image',
        group: 'Qwen',
        section: 'image',
        cost: 4,
        costLabel: '4 credits',
        costUnit: 'image',
        modes: ['image'],
        tags: ['txt2img'],
        premium: true,
        defaultSize: 'square',
        webhookKey: 'QWEN_IMAGE_WEBHOOK_URL',
        iconClass: 'model-icon-qwen',
        maxImages: 1,
        description: 'High-fidelity images powered by Qwen AI.',
    },
    {
        id: 'pixplace_pro',
        name: 'Flux Pro Advanced',
        group: 'Flux',
        section: 'image',
        cost: 4,
        costLabel: '4 credits',
        costUnit: 'image',
        modes: ['image'],
        tags: ['txt2img', 'img2img'],
        premium: true,
        defaultSize: '1024x1024',
        webhookKey: 'WEBHOOK_URL',
        iconClass: 'model-icon-flux',
        maxImages: 1,
        description: 'Switch to Professional Mode — ideal for logo design, text compositions, and complex layouts.',
    },
    {
        id: 'fast_generation',
        name: 'Flux Fast',
        group: 'Flux',
        section: 'image',
        cost: 1,
        costLabel: '1 credit',
        costUnit: 'image',
        modes: ['image'],
        tags: ['txt2img'],
        premium: false,
        defaultSize: '1024x1024',
        webhookKey: 'WEBHOOK_URL',
        iconClass: 'model-icon-flux',
        maxImages: 0,
        description: 'Fastest model for quick image generation — works instantly.',
    },
    {
        id: 'print_maker',
        name: 'Print on Demand',
        group: 'SDXL',
        section: 'image',
        cost: 5,
        costLabel: '5 credits',
        costUnit: 'image',
        modes: ['image'],
        tags: ['txt2img', 'img2img'],
        premium: true,
        defaultSize: '1024x1024',
        webhookKey: 'WEBHOOK_URL',
        iconClass: 'model-icon-sdxl',
        maxImages: 1,
        description: 'Specially crafted for Print-on-Demand creators — make print-ready designs.',
    },
    {
        id: 'sticker_maker',
        name: 'Stickers',
        group: 'SDXL',
        section: 'image',
        cost: 5,
        costLabel: '5 credits',
        costUnit: 'image',
        modes: ['image'],
        tags: ['txt2img', 'img2img'],
        premium: true,
        defaultSize: '1024x1024',
        webhookKey: 'WEBHOOK_URL',
        iconClass: 'model-icon-sdxl',
        maxImages: 1,
        description: 'Create beautiful die-cut stickers instantly.',
    },
    {
        id: 'dreamshaper_xl',
        name: 'Dreamshaper XL',
        group: 'SDXL',
        section: 'image',
        cost: 1,
        costLabel: '1 credit',
        costUnit: 'image',
        modes: ['image'],
        tags: ['txt2img', 'img2img'],
        premium: false,
        defaultSize: '1024x1024',
        webhookKey: 'WEBHOOK_URL',
        iconClass: 'model-icon-sdxl',
        maxImages: 1,
        description: 'Fast generation model designed as an all-in-one for photos and stylized art.',
    },

    // ═══════════════════════ IMAGE EDITING ═══════════════════════
    {
        id: 'qwen_image_edit',
        name: 'Qwen Image Edit',
        group: 'Qwen',
        section: 'edit',
        cost: 4,
        costLabel: '4 credits',
        costUnit: 'image',
        modes: ['edit'],
        tags: ['edit'],
        premium: true,
        defaultSize: 'square',
        webhookKey: 'QWEN_IMAGE_WEBHOOK_URL',
        iconClass: 'model-icon-qwen',
        maxImages: 1,
        description: 'Smart editing capabilities powered by Qwen AI.',
    },
    {
        id: 'upscale_image',
        name: 'Enhance Image',
        group: 'Tools',
        section: 'edit',
        cost: 5,
        costLabel: '5 credits',
        costUnit: 'image',
        modes: ['image', 'edit'],
        tags: ['img2img', 'edit'],
        premium: false,
        webhookKey: 'N8N_ENHANCE_OR_REMBG_WEBHOOK_URL',
        iconClass: 'model-icon-other',
        maxImages: 1,
        description: 'Boost image quality and resolution — make your visuals look crisp and detailed.',
    },
    {
        id: 'background_removal',
        name: 'Remove Background',
        group: 'Tools',
        section: 'edit',
        cost: 2,
        costLabel: '2 credits',
        costUnit: 'image',
        modes: ['image', 'edit'],
        tags: ['img2img', 'edit'],
        premium: false,
        webhookKey: 'N8N_ENHANCE_OR_REMBG_WEBHOOK_URL',
        iconClass: 'model-icon-other',
        maxImages: 1,
        description: 'Remove the background and keep the main object.',
    },

    // ═══════════════════════ AI VIDEO ═══════════════════════
    {
        id: 'image_to_video',
        name: 'Seedance 1.0',
        group: 'ByteDance',
        section: 'video',
        cost: 4,
        costLabel: '4 credits',
        costUnit: 'sec',
        modes: ['video'],
        tags: ['video'],
        premium: true,
        webhookKey: 'WEBHOOK_URL',
        iconClass: 'model-icon-video',
        maxImages: 1,
        description: 'Bring static images to life! Transform photos into smooth, animated video sequences.',
    },
    {
        id: 'video_gen',
        name: 'Wan 2.1',
        group: 'Alibaba',
        section: 'video',
        cost: 3,
        costLabel: '3 credits',
        costUnit: 'sec',
        modes: ['video'],
        tags: ['video'],
        premium: true,
        webhookKey: 'WEBHOOK_URL',
        iconClass: 'model-icon-video',
        maxImages: 1,
        description: 'Transform your ideas into dynamic videos from scratch.',
    },
    {
        id: 'kling_video',
        name: 'Kling AI 1.5 Standard',
        group: 'Kuaishou',
        section: 'video',
        cost: 4,
        costLabel: '4 credits',
        costUnit: 'sec',
        modes: ['video'],
        tags: ['video'],
        premium: true,
        webhookKey: 'WEBHOOK_URL',
        iconClass: 'model-icon-video',
        maxImages: 1,
        description: 'Standard fast AI video generation.',
    },
    {
        id: 'kling_video_pro',
        name: 'Kling AI 1.6 Pro',
        group: 'Kuaishou',
        section: 'video',
        cost: 7,
        costLabel: '7 credits',
        costUnit: 'sec',
        modes: ['video'],
        tags: ['video'],
        premium: true,
        webhookKey: 'WEBHOOK_URL',
        iconClass: 'model-icon-video',
        maxImages: 1,
        description: 'High quality professional AI video generation.',
    },
    {
        id: 'kling_video_master',
        name: 'Kling AI 2.0 Master',
        group: 'Kuaishou',
        section: 'video',
        cost: 10,
        costLabel: '10 credits',
        costUnit: 'sec',
        modes: ['video'],
        tags: ['video'],
        premium: true,
        webhookKey: 'WEBHOOK_URL',
        iconClass: 'model-icon-video',
        maxImages: 1,
        description: 'Ultimate cinematographic video generation.',
    },
    {
        id: 'runway_gen3',
        name: 'Runway Gen-4',
        group: 'Runway',
        section: 'video',
        cost: 8,
        costLabel: '8 credits',
        costUnit: 'sec',
        modes: ['video'],
        tags: ['video'],
        premium: true,
        webhookKey: 'WEBHOOK_URL',
        iconClass: 'model-icon-video',
        maxImages: 1,
        description: 'The latest generation video model from Runway.',
    },

    // ═══════════════════════ AI MUSIC ═══════════════════════
    {
        id: 'audio_from_text',
        name: 'Audio from Text',
        group: 'Suno AI',
        section: 'music',
        cost: 5,
        costLabel: '5 credits',
        costUnit: 'track',
        modes: ['sound'],
        tags: ['audio'],
        premium: true,
        webhookKey: 'SUNO_AUDIO_FROM_TEXT_WEBHOOK_URL',
        iconClass: 'model-icon-other',
        maxImages: 0,
        description: 'Generate a full song with vocals from a simple text prompt.',
    },
    {
        id: 'audio_from_image',
        name: 'Audio from Image',
        group: 'Suno AI',
        section: 'music',
        cost: 5,
        costLabel: '5 credits',
        costUnit: 'track',
        modes: ['sound'],
        tags: ['audio'],
        premium: true,
        webhookKey: 'SUNO_AUDIO_FROM_IMAGE_WEBHOOK_URL',
        iconClass: 'model-icon-other',
        maxImages: 1,
        description: 'Upload an image and AI will compose a song inspired by it.',
    },
];

// ─── Lookup index (built once on import) ─────────────────────────────────────
const _byId = new Map(MODEL_REGISTRY.map(m => [m.id, m]));

// ─── Public helpers ──────────────────────────────────────────────────────────

/**
 * Get a model entry by its ID.
 * @param {string} id
 * @returns {object|undefined}
 */
export function getModelById(id) {
    return _byId.get(id);
}

/**
 * Get the credit cost for a model (supports dynamic resolution pricing).
 * @param {string} id - model ID
 * @param {string} [resolution] - optional resolution key, e.g. '1k', '2k', '4k'
 * @returns {number} credit cost (0 if model not found)
 */
export function getModelCost(id, resolution) {
    const model = _byId.get(id);
    if (!model) return 0;

    if (resolution && model.dynamicCost) {
        const resKey = resolution.toLowerCase();
        if (model.dynamicCost[resKey] !== undefined) {
            return model.dynamicCost[resKey];
        }
    }
    return model.cost;
}

/**
 * Get the display cost label (e.g. "3 cr", "5–11 cr").
 * @param {string} id
 * @returns {string}
 */
export function getModelCostLabel(id) {
    const model = _byId.get(id);
    return model ? model.costLabel : '—';
}

/**
 * Get all models that appear in a given tab/mode.
 * @param {string} mode - tab name: 'image', 'edit', 'video', 'sound'
 * @returns {object[]}
 */
export function getModelsByMode(mode) {
    return MODEL_REGISTRY.filter(m => m.modes.includes(mode));
}

/**
 * Get all models grouped by their `section` key (for pricing table rendering).
 * @returns {Map<string, object[]>}
 */
export function getModelsBySection() {
    const sections = new Map();
    for (const m of MODEL_REGISTRY) {
        if (!sections.has(m.section)) sections.set(m.section, []);
        sections.get(m.section).push(m);
    }
    return sections;
}

/**
 * Check if a model requires a premium subscription.
 * @param {string} id
 * @returns {boolean}
 */
export function isModelPremium(id) {
    const model = _byId.get(id);
    return model ? model.premium : false;
}

/**
 * Get the default size for a model.
 * @param {string} id
 * @returns {string|undefined}
 */
export function getModelDefaultSize(id) {
    const model = _byId.get(id);
    return model?.defaultSize;
}

// Attach to window for synchronous access from iframes
if (typeof window !== 'undefined') {
    window.MODEL_REGISTRY = MODEL_REGISTRY;
    window.getModelsBySection = getModelsBySection;
    window.getModelCost = getModelCost;
    window.getModelsByMode = getModelsByMode;
    window.getModelById = getModelById;
    window.getModelCostLabel = getModelCostLabel;
    window.getModelDefaultSize = getModelDefaultSize;
}
