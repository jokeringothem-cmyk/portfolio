export interface ProjectMedia {
  video?: string;
  poster?: string;
  results?: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  tags: string[];
  summary: string;
  highlights: string[];
  media: ProjectMedia;
  codeAvailable: boolean;
  pdfAvailable: boolean;
}

export const projects: Project[] = [
  {
    id: "np3o",
    title: "NP3O",
    subtitle: "Barlow Twins + Cost-Constrained PPO for Legged Locomotion",
    tags: ["RL", "Robotics", "Contrastive Learning", "Isaac Gym", "H100"],
    summary:
      "A PPO variant integrating Barlow Twins contrastive learning with cost-constrained policy optimization. Trained on 4096 parallel Go2 environments, converging in 1600 iterations while outperforming the standard 10000-iteration RMA baseline on H100 hardware.",
    highlights: [
      "Barlow Twins loss replaces RMA teacher-student distillation — encoder contrasts past vs future 5-frame windows to learn time-invariant proprioceptive representations",
      "Cost-Constrained PPO: 3 safety costs (joint pos/torque/vel limits), Softplus cost critic, k-value annealing curriculum (×1.0004/iter capped at 1.0)",
      "Velocity prediction head: MSE(z_vel, priv_vel) auxiliary loss — encoder learns to predict robot velocity from history as privileged information proxy",
      "10+ actor variants explored: BarlowTwins, VQ-VAE, Beta-VAE, Masked AE, SimSiam, MoE(8 experts)+Barlow, Transformer+Barlow, RNN+Lipschitz gate",
      "H100 deployment: graphics_device_id=-1 Vulkan bypass, 4096 envs × 24 steps/rollout, adaptive KL learning rate",
      "model_1600 vs author_10000: total reward 0.058→0.056, base height stability 0.31→0.27m, velocity tracking error 0.191→0.244",
    ],
    media: {
      video: "/media/np3o_mymodel_1600iter.mp4",
      poster: "/media/np3o_poster.jpg",
    },
    codeAvailable: true,
    pdfAvailable: true,
  },
  {
    id: "apexnav",
    title: "ApexNav",
    subtitle: "Zero-Shot Visual Language Navigation with Scene-Aware Perception",
    tags: ["VLN", "Foundation Models", "Zero-Shot", "LLM", "Navigation"],
    summary:
      "Zero-shot VLN system using LLM semantic priors + 4-model parallel perception (GroundingDINO, YOLOv7, SAM, BLIP2) for object search without environment-specific training. Extended to outdoor park/city navigation with FlyCo-inspired open-world scene adaptation.",
    highlights: [
      "LLM Semantic Prior: outputs [similar_objects×3–5, confidence∈[0.25,0.65], room/zone] for spatial reasoning and confusion-aware detection",
      "4-Model Parallel Perception: GroundingDINO + YOLOv7 detection, SAM segmentation, BLIP2 open-vocabulary scene description — all per-frame parallel inference",
      "Semantic Frontier Map: 3D voxel projection with semantic labels, frontier exploration guided by LLM spatial priors (room/zone based)",
      "TSP Adaptive Exploration: traveling salesman over semantic frontiers for efficient coverage; zone-aware exploration strategy",
      "Scene Adaptation: BLIP2 real-time scene queries for outdoor park/urban/indoor switching; dynamic zone labels (path_side, picnic_area, near_building, inside_building)",
      "Evaluated on HM3D/MP3D indoor benchmarks; outdoor park extension designed with building-interior boundary handling",
    ],
    media: {
      results: "/media/apexnav_results.json",
    },
    codeAvailable: true,
    pdfAvailable: false,
  },
  {
    id: "simpletool",
    title: "SimpleTool",
    subtitle: "Multi-Head Parallel Decoding for LLM Tool Use",
    tags: ["LLM", "Tool Use", "vLLM", "Inference", "Qwen"],
    summary:
      "8-head parallel decoding architecture for tool calls — content, function, and 6 argument heads decoded simultaneously on vLLM. Eliminates autoregressive bottleneck in tool-use generation. Built on RT-Qwen3-4B-AWQ and deployed in production live-streaming AI.",
    highlights: [
      "8-Head Parallel Decoding: Content + Function + 6 Argument heads on vLLM — each head independently generates its portion of the tool call simultaneously",
      "RT-Qwen3-4B-AWQ backbone: 4B quantized model on consumer GPU with multi-tool coordination capability (confirmed 4B collapses to single tool, 8B+ needed for multi-tool)",
      "Eliminates sequential bottleneck: standard tool-calling generates function→arg1→arg2... autoregressively; parallel heads decode all slots simultaneously",
      "vLLM integration: continuous batching + PagedAttention for high-throughput batched inference",
      "Production deployment in Open LLM Vtuber: real-time tool orchestration (search, memory, expression, animation) during live streams",
    ],
    media: {
      poster: "/media/simpletool.jpg",
    },
    codeAvailable: true,
    pdfAvailable: false,
  },
  {
    id: "air-planner",
    title: "AIR-Planner",
    subtitle: "Multi-Agent RL + MPC for Autonomous Drone Planning",
    tags: ["MARL", "MPC", "Drones", "MAPPO", "qpOASES"],
    summary:
      "Autonomous drone planning combining Multi-Agent PPO with MPC. CNN+GRU recurrent policies with PopArt normalization for three mission modes: GoTo, MinTime, and PerceptionAware. ACADO-generated optimal control with qpOASES solver for real-time trajectory optimization.",
    highlights: [
      "MAPPO/MAPPG multi-agent policy: CNN+GRU recurrent architecture with PopArt adaptive value normalization for stable training",
      "Three mission modes: GoTo (target reaching), MinTime (time-optimal trajectory), PerceptionAware (maximize visual coverage while navigating)",
      "MPC layer: ACADO-generated optimal control code with qpOASES quadratic programming solver for real-time feasibility",
      "Hybrid RL+MPC: RL handles strategic decisions, MPC ensures dynamic feasibility and safety constraint satisfaction",
    ],
    media: {
      video: "/media/air_planner.mp4",
    },
    codeAvailable: true,
    pdfAvailable: false,
  },
  {
    id: "research-assistant",
    title: "Research Assistant",
    subtitle: "16-Agent LangGraph System with Chainlit UI",
    tags: ["LangGraph", "Multi-Agent", "Chainlit", "RAG", "LLM"],
    summary:
      "Comprehensive multi-agent academic research system: LangGraph StateGraph with 16 specialist agents in star topology. Dual Chainlit+CLI interface, PostgresSaver checkpointing, PPT-Master slide generation, and two-phase AGENTREVIEW/REBUTTALAGENT peer review pipeline.",
    highlights: [
      "16 specialist agents: Literature Search, Paper Analysis, Code Generation, Experiment Design, Result Interpretation, Writing, Review, Rebuttal, and more in star topology",
      "LangGraph StateGraph orchestration with PostgresSaver persistent checkpointing (SQLite fallback for local development)",
      "Chainlit UI + CLI dual interface: web-based interactive research + CLI batch automation",
      "PPT-Master hybrid slide generation: automatic academic presentations from research outputs",
      "AGENTREVIEW+REBUTTALAGENT: two-phase academic review simulation — one agent reviews, another generates rebuttals",
      "LangSmith tracing/monitoring integrated from day one for full agent observability",
    ],
    media: {
      video: "/media/research_assistant.mp4",
    },
    codeAvailable: true,
    pdfAvailable: false,
  },
  {
    id: "llm-vtuber",
    title: "Open LLM VTuber",
    subtitle: "Real-Time AI Virtual Streamer with Multi-Tool Coordination",
    tags: ["LLM", "VTuber", "Real-Time", "Multi-Modal", "Live2D"],
    summary:
      "Production AI VTuber system for real-time live streaming: natural language interaction, facial expression control, and multi-tool orchestration. Integrates SimpleTool parallel decoding for low-latency tool calls. Coordinates search, memory, expression animation, and voice synthesis simultaneously.",
    highlights: [
      "Real-time LLM-driven interaction: natural conversation with viewers, context-aware responses during live streams",
      "SimpleTool backend integration: 8-head parallel decoding enables simultaneous tool calls without sequential latency",
      "Multi-modal output pipeline: coordinated voice synthesis + Live2D/VRM facial expression + on-screen visual effects",
      "Persistent memory system: viewer interaction history for personalized cross-session streaming experience",
      "Production deployment: serves as the real-world demonstration of SimpleTool architecture in a live streaming context",
    ],
    media: {
      poster: "/media/llm_vtuber.jpg",
    },
    codeAvailable: true,
    pdfAvailable: false,
  },
];
