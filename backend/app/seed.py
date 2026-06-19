"""Seed initial project data from the current portfolio."""

import asyncio
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import async_session
from app.models.project import Project, Highlight, Tag


SEED_DATA = [
    {
        "slug": "np3o",
        "title": "NP3O",
        "title_en": "NP3O",
        "subtitle": "Barlow Twins 对比学习 · Cost-Constrained PPO · 四条腿机器人运动",
        "subtitle_en": "Barlow Twins Contrastive Learning · Cost-Constrained PPO · Quadrupedal Locomotion",
        "category": "Reinforcement Learning",
        "category_en": "Reinforcement Learning",
        "brief": "下一代 PPO 变体。Barlow Twins 对比学习替代标准 RMA teacher-student 蒸馏，1600 轮即收敛——超越 10000 轮基线，跟踪精度与稳定性均更优。",
        "brief_en": "A next-generation PPO variant. Barlow Twins contrastive learning replaces standard RMA teacher-student distillation — converges in 1,600 iterations, outperforming the 10,000-iteration baseline in both tracking accuracy and stability.",
        "media_type": "dual-video",
        "video_left_path": "/media/np3o_mymodel_1600iter.mp4",
        "video_left_label": "NP3O · 1600 轮",
        "video_left_label_en": "NP3O · 1,600 Iterations",
        "video_right_path": "/media/go2_walking.mp4",
        "video_right_label": "NP3O · 10000 轮 Benchmark",
        "video_right_label_en": "NP3O · 10,000 Iter Benchmark",
        "code_path": "/code/np3o.zip",
        "github_url": "https://github.com/jokeringothem-cmyk/np3o",
        "bg_color": "bg-white",
        "sort_order": 0,
        "highlights": [
            "Barlow Twins 损失函数对比过去与未来 5 帧本体感知窗口——无需特权信息即可学习时不变表征",
            "Cost-Constrained PPO：3 项安全约束（关节限位/力矩/速度），Softplus 成本 critic，k 值退火课程",
            "速度预测辅助头：MSE(z_vel, priv_vel)——编码器从历史状态预测机器人速度",
            "10+ Actor 变体探索：VQ-VAE、Beta-VAE、Masked AE、SimSiam、MoE(8 experts)、Transformer+Barlow、RNN+Lipschitz",
            "H100 部署：4096 环境 × 24 步/rollout，graphics_device_id=-1 绕过图形栈",
            "model_1600 全面优于 author_10000：总奖励 0.058→0.056，基座高度 0.31→0.27m，跟踪误差 0.191→0.244",
        ],
        "highlights_en": [
            "Barlow Twins loss over past/future 5-frame proprioceptive windows — learns time-invariant representations without privileged information",
            "Cost-Constrained PPO: 3 safety constraints (joint limits/torque/velocity), Softplus cost critic, k-value annealing curriculum",
            "Velocity prediction auxiliary head: MSE(z_vel, priv_vel) — encoder predicts robot velocity from historical states",
            "10+ Actor variants explored: VQ-VAE, Beta-VAE, Masked AE, SimSiam, MoE (8 experts), Transformer+Barlow, RNN+Lipschitz",
            "H100 deployment: 4096 environments × 24 steps/rollout, graphics_device_id=-1 bypasses graphics stack",
            "model_1600 comprehensively outperforms author_10000: total reward 0.058→0.056, base height 0.31→0.27m, tracking error 0.191→0.244",
        ],
        "tags": [],
    },
    {
        "slug": "apexnav",
        "title": "Open Nav",
        "title_en": "Open Nav",
        "subtitle": "零样本视觉语言导航 · 4 模型并行感知 · LLM 语义先验 · 室内仿真 + 户外第一人称",
        "subtitle_en": "Zero-Shot Vision-Language Navigation · 4-Model Parallel Perception · LLM Semantic Priors · Indoor Sim + Outdoor First-Person",
        "category": "Visual Navigation",
        "category_en": "Visual Navigation",
        "brief": "无需环境特定训练的零样本物体搜索。LLM 提供语义先验（物体共现、空间分区概率），4 个基础模型并行感知。6 种室内仿真场景全面验证，扩展至户外城市 3D 第一人称相机实时物体搜索。",
        "brief_en": "Zero-shot object search without environment-specific training. LLMs provide semantic priors (object co-occurrence, spatial zone probabilities); 4 foundation models run parallel perception. Validated across 6 indoor simulation scenes and extended to outdoor urban 3D first-person real-time object search.",
        "media_type": "video",
        "video_path": "/media/apexnav.mp4",
        "code_path": "/code/apexnav.zip",
        "github_url": "https://github.com/jokeringothem-cmyk/open-nav",
        "results_path": "/media/apexnav_results.json",
        "results_label": "Benchmark 结果 (JSON)",
        "results_label_en": "Benchmark Results (JSON)",
        "gallery": '[{"type":"video","path":"/media/apex.basis.glb_0.mp4","label":"室内仿真场景 A"},{"type":"video","path":"/media/apex.basis.glb_2.mp4","label":"室内仿真场景 C"},{"type":"video","path":"/media/apex.basis.glb_4.mp4","label":"室内仿真场景 E"},{"type":"video","path":"/media/apex.basis.glb_5.mp4","label":"室内仿真场景 F"},{"type":"video","path":"/media/3d_urban_simulation.mp4","label":"户外城市 3D 第一人称物体搜索"}]',
        "bg_color": "bg-[#f5f5f7]",
        "sort_order": 1,
        "highlights": [
            "LLM 语义先验：为每个目标输出 [similar_objects×3–5, confidence∈[0.25,0.65], room/zone]——空间推理与混淆感知检测",
            "4 模型并行感知：GroundingDINO + YOLOv7（检测）、SAM（分割）、BLIP2（开放词汇场景描述）——每帧并行推理",
            "语义前沿地图：3D 体素投影 + 语义标签，前沿探索由 LLM 空间先验引导",
            "TSP 自适应探索：语义前沿上的旅行商问题规划；区域感知策略动态调整搜索行为",
            "6 种室内仿真场景全面评测：不同房间布局、物体配置、光照条件下的零样本导航表现",
            "户外第一人称城市搜索：3D 城市场景中第一人称相机实时导航，BLIP2 开放词汇场景查询，动态区域语义标签",
        ],
        "highlights_en": [
            "LLM Semantic Priors: outputs [similar_objects×3–5, confidence∈[0.25,0.65], room/zone] per target — spatial reasoning with confusion-aware detection",
            "4-Model Parallel Perception: GroundingDINO + YOLOv7 (detection), SAM (segmentation), BLIP2 (open-vocabulary scene description) — parallel inference per frame",
            "Semantic Frontier Map: 3D voxel projection + semantic labels, frontier exploration guided by LLM spatial priors",
            "TSP Adaptive Exploration: traveling-salesman planning on semantic frontiers; zone-aware strategy dynamically adjusts search behavior",
            "Evaluated across 6 indoor simulation scenes: varied room layouts, object configurations, and lighting conditions",
            "Outdoor first-person urban search: real-time navigation with first-person camera in 3D city scenes, BLIP2 open-vocabulary queries, dynamic zone semantic labeling",
        ],
        "tags": [],
    },
    {
        "slug": "rrllm",
        "title": "RRLLM",
        "title_en": "RRLLM",
        "subtitle": "The Real Real-Time LLM · 8 头并行解码 · vLLM 推理 · AI 虚拟主播",
        "subtitle_en": "The Real Real-Time LLM · 8-Head Parallel Decoding · vLLM Inference · AI VTuber",
        "category": "Real-Time LLM",
        "category_en": "Real-Time LLM",
        "brief": "端到端实时 LLM 系统：SimpleTool 8 头并行解码消除自回归瓶颈 + Open LLM VTuber 生产级实时直播应用。基于 RT-Qwen3-4B-AWQ，消费级 GPU 即可运行。从推理加速到多模态直播的完整技术栈。",
        "brief_en": "An end-to-end real-time LLM system: SimpleTool 8-head parallel decoding eliminates the autoregressive bottleneck + Open LLM VTuber production-grade live streaming. Built on RT-Qwen3-4B-AWQ, runs on consumer GPUs. Complete tech stack from inference acceleration to multimodal live streaming.",
        "media_type": "image",
        "poster_path": "/media/simpletool.jpg",
        "code_path": "/code/simpletool.zip",
        "code_label": "下载代码（含 SimpleTool + VTuber 桥接）",
        "code_label_en": "Download Code (SimpleTool + VTuber Bridge)",
        "github_url": "https://github.com/jokeringothem-cmyk/rrllm-",
        "gallery": '[{"type": "image", "path": "/media/simpletool.jpg", "label": "运行在 Terraria 上面的效果"}, {"type": "image", "path": "/media/rrllm_app.jpg", "label": "运行在 VTuber 上面的效果"}]',
        "bg_color": "bg-white",
        "sort_order": 2,
        "highlights": [
            "SimpleTool 核心：8 头并行解码——Content + Function + 6 Argument 头在 vLLM 上同时解码，消除工具调用的自回归串行瓶颈",
            "RT-Qwen3-4B-AWQ 骨干：4B 量化模型，消费级 GPU，多工具协调（确认 4B 会坍缩为单工具，8B+ 才稳定多工具）",
            "vLLM continuous batching + PagedAttention 高吞吐推理",
            "VTuber 应用层：实时 LLM 驱动对话 + Live2D/VRM 面部表情控制 + 语音合成 + 屏幕视觉特效",
            "多工具实时编排：搜索、记忆、表情动画、语音合成——并行头一次解码所有槽位，直播零延迟",
            "持久记忆系统：观众交互历史，跨场次个性化直播体验",
        ],
        "highlights_en": [
            "SimpleTool Core: 8-head parallel decoding — Content + Function + 6 Argument heads decode simultaneously on vLLM, eliminating the autoregressive serial bottleneck for tool calls",
            "RT-Qwen3-4B-AWQ Backbone: 4B quantized model on consumer GPUs; multi-tool coordination (confirmed 4B collapses to single tool; 8B+ needed for stable multi-tool use)",
            "vLLM continuous batching + PagedAttention for high-throughput inference",
            "VTuber Application Layer: real-time LLM-driven dialogue + Live2D/VRM facial expression control + TTS + on-screen visual effects",
            "Multi-Tool Real-Time Orchestration: search, memory, expression animation, TTS — parallel heads decode all slots in one pass for zero-latency live streaming",
            "Persistent Memory System: audience interaction history for personalized cross-session live streaming experiences",
        ],
        "tags": [],
    },
    {
        "slug": "air-planner",
        "title": "AIR-Planner",
        "title_en": "AIR-Planner",
        "subtitle": "多智能体强化学习 + MPC · RACER 分布式集群协同探索 · ROS1→ROS2 桥接",
        "subtitle_en": "Multi-Agent RL + MPC · RACER Distributed Swarm Exploration · ROS1→ROS2 Bridge",
        "category": "Aerial Autonomy",
        "category_en": "Aerial Autonomy",
        "brief": "基于 MAPPO/MAPPG 多智能体强化学习与 MPC 的自主无人机航迹规划系统。CNN+GRU 循环策略网络 + PopArt 自适应值归一化，ACADO 最优控制 + qpOASES 实时轨迹优化。引入 RACER 算法实现 swarm_exploration 分布式多机协同探索，自研 ROS1→ROS2 跨版本桥接层打通新旧生态。",
        "brief_en": "An autonomous UAV trajectory planning system combining MAPPO/MAPPG multi-agent reinforcement learning with MPC. CNN+GRU recurrent policy networks with PopArt adaptive value normalization; ACADO optimal control + qpOASES real-time trajectory optimization. Introduces the RACER algorithm for distributed swarm exploration with a custom ROS1→ROS2 bridge.",
        "media_type": "video",
        "video_path": "/media/air_planner.mp4",
        "code_path": "/code/air-planner.zip",
        "github_url": "https://github.com/jokeringothem-cmyk/air-planner",
        "gallery": '[{"type": "video", "path": "/media/air_planner_racer.mp4", "label": "RACER 分布式集群协同探索"}]',
        "bg_color": "bg-[#f5f5f7]",
        "sort_order": 3,
        "highlights": [
            "MAPPO/MAPPG 多智能体策略：CNN+GRU 循环架构，PopArt 自适应值归一化保证多智能体训练稳定收敛",
            "RACER 分布式集群算法：swarm_exploration 多机协同探索，动态任务分配与信息共享，实现多无人机分布式覆盖搜索",
            "ROS1→ROS2 跨版本桥接：自研桥接层兼容 ROS1 遗留节点与 ROS2 新生态，打通仿真到真机全链路",
            "MPC 轨迹优化：ACADO 自动微分生成最优控制代码 + qpOASES 二次规划实时求解，保证动力学可行性",
            "RL+MPC 混合架构：强化学习负责高层战略决策，模型预测控制保证底层安全约束与实时响应",
        ],
        "highlights_en": [
            "MAPPO/MAPPG Multi-Agent Policy: CNN+GRU recurrent architecture with PopArt adaptive value normalization for stable multi-agent training convergence",
            "RACER Distributed Swarm Algorithm: swarm_exploration multi-UAV cooperative search with dynamic task assignment and information sharing for distributed coverage",
            "ROS1→ROS2 Cross-Version Bridge: custom bridge layer compatible with ROS1 legacy nodes and ROS2 ecosystem, connecting simulation to real hardware end-to-end",
            "MPC Trajectory Optimization: ACADO auto-differentiation generates optimal control code + qpOASES real-time quadratic programming for dynamically feasible trajectories",
            "RL+MPC Hybrid Architecture: reinforcement learning handles high-level strategic decisions; MPC guarantees low-level safety constraints and real-time response",
        ],
        "tags": [],
    },
    {
        "slug": "research-assistant",
        "title": "Research Assistant",
        "title_en": "Research Assistant",
        "subtitle": "16 Agent · LangGraph 多智能体 · 学术研究全流程",
        "subtitle_en": "16 Agents · LangGraph Multi-Agent · Full Academic Research Pipeline",
        "category": "Multi-Agent Systems",
        "category_en": "Multi-Agent Systems",
        "brief": "综合多智能体学术研究系统。LangGraph StateGraph 协调 16 个专业智能体，星形拓扑。Chainlit + CLI 双界面，PostgresSaver 检查点，PPT-Master 幻灯片生成，AGENTREVIEW+REBUTTALAGENT 双阶段审稿。",
        "brief_en": "A comprehensive multi-agent academic research system. LangGraph StateGraph orchestrates 16 specialized agents in a star topology. Chainlit + CLI dual interfaces, PostgresSaver checkpointing, PPT-Master slide generation, AGENTREVIEW+REBUTTALAGENT two-phase peer review.",
        "media_type": "video",
        "video_path": "/media/research_assistant.mp4",
        "code_path": "/code/research-assistant.zip",
        "github_url": "https://github.com/jokeringothem-cmyk/research-assistant-",
        "bg_color": "bg-white",
        "sort_order": 4,
        "highlights": [
            "16 个专业智能体：文献检索、论文分析、代码生成、实验设计、写作、审稿、驳斥等——星形拓扑协作",
            "LangGraph StateGraph 编排 + PostgresSaver 持久化检查点（SQLite 本地回退）",
            "Chainlit + CLI 双界面：Web 交互式研究 + 命令行批处理自动化",
            "PPT-Master 混合幻灯片：从研究成果自动生成学术演示文稿",
            "AGENTREVIEW + REBUTTALAGENT：双阶段学术审稿模拟——审稿后生成驳斥回应",
            "LangSmith 全程追踪与监控",
        ],
        "highlights_en": [
            "16 Specialized Agents: literature retrieval, paper analysis, code generation, experiment design, writing, review, rebuttal — star-topology collaboration",
            "LangGraph StateGraph orchestration + PostgresSaver persistent checkpointing (SQLite local fallback)",
            "Chainlit + CLI Dual Interface: interactive web-based research + command-line batch automation",
            "PPT-Master Hybrid Slides: auto-generates academic presentations from research outputs",
            "AGENTREVIEW + REBUTTALAGENT: two-phase academic peer review simulation — review then generate rebuttal responses",
            "LangSmith end-to-end tracing and monitoring",
        ],
        "tags": [],
    },
    {
        "slug": "fint",
        "title": "Tunnel Searcher",
        "title_en": "Tunnel Searcher",
        "subtitle": "狭窄隧道自主飞行 · EDF 距离场 · B 样条轨迹优化 · FastLIO 定位",
        "subtitle_en": "Narrow Tunnel Autonomous Flight · EDF Distance Field · B-Spline Trajectory Optimization · FastLIO Localization",
        "category": "Autonomous Flight",
        "category_en": "Autonomous Flight",
        "brief": "首个能在直径仅 0.5m 真实隧道中全方向自主飞行的四旋翼系统。EDF 欧式距离场实时建图，霍夫变换 + CNN 检测截面形状，一维动力学 A* 降维搜索，B 样条多目标轨迹优化。FastLIO 紧耦合 LiDAR-IMU 里程计提供无 GPS 定位，标注数据集训练神经网络实现感知缺陷在线检测。",
        "brief_en": "The first quadrotor system capable of omnidirectional autonomous flight in real tunnels as narrow as 0.5 m in diameter. EDF Euclidean distance field real-time mapping, Hough transform + CNN cross-section detection, 1D kinodynamic A* reduced-dimensional search, B-spline multi-objective trajectory optimization. FastLIO tightly-coupled LiDAR-IMU odometry for GPS-denied localization; annotated dataset trains a neural network for online perception defect detection.",
        "media_type": "video",
        "video_path": "/media/fint_video.mp4",
        "poster_path": "/media/fint_detail.jpg",
        "code_path": "/code/fint.zip",
        "github_url": "https://github.com/jokeringothem-cmyk/fint-searcher",
        "gallery": '[{"type": "image", "path": "/media/fint_detail.jpg", "label": "Tunnel Searcher 系统架构与硬件平台"}]',
        "bg_color": "bg-[#f5f5f7]",
        "sort_order": 5,
        "highlights": [
            "首次实现四旋翼在 0.5m 直径真实狭窄隧道内的任意方向自主穿行",
            "EDF 距离场建图 + 霍夫圆/矩形检测 + CNN 形状分类器——实时感知隧道截面几何结构",
            "一维动力学 A* 搜索：将 3D 隧道规划降维为沿中心线的位置-速度二维状态空间搜索，生成动力学可行初解",
            "B 样条多目标轨迹优化：NLopt 优化控制点，联合考虑平滑性、障碍物距离、视觉光流质量与气流扰动抑制",
            "光流 + 气流扰动联合建模：将视觉质量与扰动纳入轨迹优化代价函数而非后处理，实现感知-规划闭环",
            "FastLIO 紧耦合 LiDAR-IMU 里程计：作为前端定位观测模块，提供高频率低延迟的无人机位姿估计，支撑隧道无 GPS 自主飞行",
            "感知缺陷在线检测：人工标注感知失效样本构建训练集 → 训练神经网络分类器识别缺陷位置 → 在线推理检测视觉算法输出异常，触发降级恢复策略确保飞行安全",
            "完整 ROS 仿真生态：SO3 控制、VINS-Multi 多相机状态估计、隧道入口 Marker 检测、RViz 可视化",
        ],
        "highlights_en": [
            "First-ever autonomous omnidirectional quadrotor flight through real narrow tunnels as small as 0.5 m in diameter",
            "EDF distance field mapping + Hough circle/rectangle detection + CNN shape classifier — real-time tunnel cross-section geometry perception",
            "1D Kinodynamic A* Search: reduces 3D tunnel planning to 2D position-velocity state-space search along the centerline, producing a kinodynamically feasible initial solution",
            "B-Spline Multi-Objective Trajectory Optimization: NLopt optimizes control points jointly considering smoothness, obstacle distance, visual optical flow quality, and airflow disturbance rejection",
            "Optical Flow + Airflow Disturbance Joint Modeling: integrates visual quality and disturbance into the trajectory optimization cost function rather than post-processing, closing the perception-planning loop",
            "FastLIO Tightly-Coupled LiDAR-IMU Odometry: front-end localization module providing high-frequency low-latency pose estimation for GPS-denied tunnel flight",
            "Perception Defect Online Detection: manually annotate perception failure samples → train neural network classifier to identify defect locations → online inference detects visual algorithm output anomalies, triggering degraded recovery strategies to ensure flight safety",
            "Complete ROS Simulation Ecosystem: SO3 control, VINS-Multi multi-camera state estimation, tunnel entrance marker detection, RViz visualization",
        ],
        "tags": [],
    },
    {
        "slug": "omni-control",
        "title": "Omni Swarm",
        "title_en": "Omni Swarm",
        "subtitle": "全驱动倾转旋翼 · PX4 飞控 · 控制分配 · 集群预留",
        "subtitle_en": "Fully-Actuated Tiltrotor · PX4 Flight Control · Control Allocation · Swarm Reserve",
        "category": "Flight Control Systems",
        "category_en": "Flight Control Systems",
        "brief": "基于 PX4 飞控框架的全驱动倾转旋翼无人机控制模块。定制角速度 PID + 解析推力分配算法，四个独立倾转舵机让无人机在悬停时也可产生水平力，实现真正全向运动。预留 swarm_bridge 集群通讯架构。",
        "brief_en": "A fully-actuated tiltrotor UAV control module built on the PX4 flight control framework. Custom angular rate PID + analytical thrust allocation algorithm; four independent tilt servos enable horizontal force generation even while hovering, achieving true omnidirectional motion. swarm_bridge cluster communication architecture reserved for future swarm expansion.",
        "media_type": "image",
        "poster_path": "/media/omni_control.jpg",
        "code_path": "/code/omni-control.zip",
        "github_url": "https://github.com/jokeringothem-cmyk/omni-swarm-",
        "bg_color": "bg-white",
        "sort_order": 6,
        "highlights": [
            "全驱动控制分配：解析公式将期望三轴力与力矩实时映射到四个倾转舵机 + 四个电机，突破传统四旋翼欠驱动限制",
            "PX4 原生模块：uORB 消息总线集成，订阅姿态/角速度/遥控器输入，发布舵机/电机输出，深度嵌入 PX4 生态",
            "SITL 仿真支持：提供完整 Gazebo SDF 模型 + ROMFS 启动脚本，可软件在环仿真验证全驱动控制逻辑",
            "角速度 PID 控制：定制内环控制器，参数可调，适配倾转旋翼独特动力学特性",
            "集群架构预留：swarm_bridge 模块定义 swarm_state 消息（模块 ID、相对位置、组合状态），支持未来分布式集群扩展",
        ],
        "highlights_en": [
            "Fully-Actuated Control Allocation: analytical formulas map desired 3-axis forces and torques in real-time to four tilt servos + four motors, breaking through the under-actuated limitation of conventional quadrotors",
            "PX4 Native Module: uORB message bus integration — subscribes to attitude/angular rate/RC input, publishes servo/motor output — deeply embedded in the PX4 ecosystem",
            "SITL Simulation Support: complete Gazebo SDF model + ROMFS startup scripts for software-in-the-loop validation of fully-actuated control logic",
            "Angular Rate PID Control: custom inner-loop controller with tunable parameters adapted to the unique tiltrotor dynamics",
            "Swarm Architecture Reserved: swarm_bridge module defines swarm_state messages (module ID, relative position, formation state) for future distributed swarm expansion",
        ],
        "tags": [],
    },
]


async def seed():
    from app.core.database import engine, Base
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as db:
        for item in SEED_DATA:
            result = await db.execute(select(Project).where(Project.slug == item["slug"]))
            if result.scalar_one_or_none():
                print(f"  SKIP {item['slug']} (already exists)")
                continue

            project = Project(
                slug=item["slug"],
                title=item["title"],
                title_en=item.get("title_en"),
                subtitle=item["subtitle"],
                subtitle_en=item.get("subtitle_en"),
                category=item["category"],
                category_en=item.get("category_en"),
                brief=item["brief"],
                brief_en=item.get("brief_en"),
                media_type=item["media_type"],
                video_path=item.get("video_path"),
                video_left_path=item.get("video_left_path"),
                video_left_label=item.get("video_left_label"),
                video_left_label_en=item.get("video_left_label_en"),
                video_right_path=item.get("video_right_path"),
                video_right_label=item.get("video_right_label"),
                video_right_label_en=item.get("video_right_label_en"),
                poster_path=item.get("poster_path"),
                code_path=item.get("code_path"),
                code_label=item.get("code_label"),
                code_label_en=item.get("code_label_en"),
                results_path=item.get("results_path"),
                results_label=item.get("results_label"),
                results_label_en=item.get("results_label_en"),
                gallery=item.get("gallery"),
                github_url=item.get("github_url"),
                bg_color=item["bg_color"],
                sort_order=item["sort_order"],
            )
            for i, content in enumerate(item["highlights"]):
                en_content = item.get("highlights_en", [None] * len(item["highlights"]))
                project.highlights.append(Highlight(
                    content=content,
                    content_en=en_content[i] if i < len(en_content) else None,
                    sort_order=i,
                ))
            for tag_name in item["tags"]:
                project.tags.append(Tag(tag=tag_name))

            db.add(project)
            print(f"  CREATED {item['slug']}")

        await db.commit()
        print("Seed complete.")


if __name__ == "__main__":
    asyncio.run(seed())
