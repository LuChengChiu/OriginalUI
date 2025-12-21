# Pattern Rules Workflow

## Overview

The Pattern Rules system is a sophisticated AI-powered ad detection engine that uses weighted rule analysis and hybrid processing strategies to identify and remove unwanted elements from web pages. It operates through multiple processing layers with intelligent optimization and performance monitoring.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    JustUI Pattern Rules System                 │
│                   AI-Powered Ad Detection Engine               │
├─────────────────────────────────────────────────────────────────┤
│ Layer 1: AdDetectionEngine (Weighted Rule Analysis)            │
│ Layer 2: Hybrid Processing Strategy (Bulk + Real-time)         │
│ Layer 3: Element Classification & Snapshot Management          │ 
│ Layer 4: Performance Optimization & Adaptive Tuning            │
└─────────────────────────────────────────────────────────────────┘
```

## Component Relationships

```
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│   Popup UI       │    │ Background Script│    │ Content Script   │
│  (App.jsx)       │◄──►│ (background.js)  │◄──►│ (content.js)     │
└──────────────────┘    └──────────────────┘    └──────────────────┘
         │                        │                        │
         │                        │                        ▼
         │                        │               ┌──────────────────┐
         │                        │               │JustUIController  │
         │                        │               │   (Orchestrator) │
         │                        │               └──────────────────┘
         │                        │                        │
         │                        │                        ▼
         │                        │               ┌──────────────────┐
         │                        │               │ Pattern Rules    │
         │                        │               │ Execution Engine │
         │                        │               └──────────────────┘
         │                        │                        │
         └────────────────────────┼────────────────────────┘
                                  │
                         ┌──────────────────┐
                         │ Chrome Storage   │
                         │   - Settings     │
                         │   - Rules Config │
                         │   - Statistics   │
                         └──────────────────┘
```

## Layer 1: AdDetectionEngine (Weighted Rule Analysis)

**File**: `src/scripts/adDetectionEngine.js`

This layer provides the core AI-powered detection capabilities using weighted rule analysis:

### Detection Rules Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Detection Rules Engine                     │
├─────────────────────────────────────────────────────────────────┤
│ Phase 1: High-Confidence Rules (P0, 90%+ confidence)          │
│ ├─ HIGH_Z_OVERLAY (Weight: 10)                                │
│ ├─ CLICK_HIJACK (Weight: 9)                                   │
│ ├─ SUSPICIOUS_IFRAME (Weight: 8)                              │
│ └─ POPUP_SCRIPT_ANALYSIS (Weight: 9)                          │
│                                                                 │
│ Phase 2: Domain & Network Rules (P1, 80%+ confidence)         │
│ ├─ MALICIOUS_DOMAIN (Weight: 7)                               │
│ ├─ MALICIOUS_EVENT_LISTENERS (Weight: 8)                      │
│ └─ LOCALSTORAGE_ABUSE (Weight: 6)                             │
│                                                                 │
│ Phase 3: Content & Behavioral Rules (P1-P2, 60%+ confidence)  │
│ ├─ SCAM_LANGUAGE (Weight: 5)                                  │
│ ├─ INTERACTION_BLOCKING (Weight: 4)                           │
│ └─ PROTOCOL_RELATIVE_URL (Weight: 3)                          │
└─────────────────────────────────────────────────────────────────┘
```

### Analysis Flow

```
┌─────────────────┐
│ Element Input   │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Execute All     │
│ Detection Rules │
│ (Parallel)      │
└─────────┬───────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Rule Execution Matrix                       │
│                                                                 │
│ ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│ │ Z-Index         │  │ Click Hijacking │  │ Iframe          │ │
│ │ Analysis        │  │ Detection       │  │ Analysis        │ │
│ │ Score: 0-10     │  │ Score: 0-9      │  │ Score: 0-8      │ │
│ └─────────┬───────┘  └─────────┬───────┘  └─────────┬───────┘ │
│           │                    │                    │         │
│           └────────────────────┼────────────────────┘         │
│                                │                              │
│ ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│ │ Domain Pattern  │  │ Script Analysis │  │ Content         │ │
│ │ Analysis        │  │ Score: 0-9      │  │ Analysis        │ │
│ │ Score: 0-7      │  │                 │  │ Score: 0-5      │ │
│ └─────────┬───────┘  └─────────┬───────┘  └─────────┬───────┘ │
│           │                    │                    │         │
│           └────────────────────┼────────────────────┘         │
│                                │                              │
│                                ▼                              │
│                     ┌─────────────────┐                       │
│                     │ Total Score     │                       │
│                     │ Calculation     │                       │
│                     │ Σ(rule_weights) │                       │
│                     └─────────┬───────┘                       │
│                               │                               │
│                               ▼                               │
│                     ┌─────────────────┐                       │
│                     │ Confidence      │                       │
│                     │ Normalization   │                       │
│                     │ min(score/30,1) │                       │
│                     └─────────┬───────┘                       │
└─────────────────────────────────┼─────────────────────────────┘
                                  │
                                  ▼
                        ┌─────────────────┐
                        │ Detection       │
                        │ Decision        │
                        │                 │
                        │ isAd = score≥15 │
                        │ && conf≥0.7     │
                        └─────────────────┘
```

### Multilingual Scam Detection

```
┌─────────────────────────────────────────────────────────────────┐
│                  Multilingual Pattern Analysis                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────────────┐              ┌─────────────────┐           │
│ │ Urgency         │              │ Savings         │           │
│ │ Patterns        │              │ Patterns        │           │
│ │                 │              │                 │           │
│ │ • EN: "limited  │              │ • EN: "save",   │           │
│ │   time", "act   │              │   "discount"    │           │
│ │   now"          │              │ • ZH: "折扣",   │           │
│ │ • ZH: "立即",   │              │   "优惠"        │           │
│ │   "限时"        │              │ • ES: "ahorro"  │           │
│ │ • ES: "urgente" │              │ • FR: "réduction"│         │
│ │ • FR: "urgent"  │              │                 │           │
│ └─────────┬───────┘              └─────────┬───────┘           │
│           │                                │                   │
│           └──────────────┬─────────────────┘                   │
│                          │                                     │
│                          ▼                                     │
│                ┌─────────────────┐                             │
│                │ Action Call     │                             │
│                │ Patterns        │                             │
│                │                 │                             │
│                │ • EN: "click    │                             │
│                │   here", "get"  │                             │
│                │ • ZH: "点击",   │                             │
│                │   "获得"        │                             │
│                │ • ES: "obtener" │                             │
│                │ • FR: "obtenir" │                             │
│                └─────────┬───────┘                             │
│                          │                                     │
│                          ▼                                     │
│                ┌─────────────────┐                             │
│                │ Pattern Match   │                             │
│                │ Scoring         │                             │
│                │                 │                             │
│                │ Each match = +2 │                             │
│                │ Multiple langs  │                             │
│                │ = Higher score  │                             │
│                └─────────────────┘                             │
└─────────────────────────────────────────────────────────────────┘
```

## Layer 2: Hybrid Processing Strategy

**File**: `src/scripts/modules/HybridProcessor.js`

This layer orchestrates dual processing strategies for optimal performance:

### Processing Strategy Selection

```
┌─────────────────┐
│ Elements Input  │
│ (Count: N)      │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐      NO      ┌─────────────────┐
│ Dependencies    │─────────────►│ Legacy          │
│ Available?      │              │ Processing      │
│ (Classifier,    │              └─────────┬───────┘
│  Snapshots)     │                        │
└─────────┬───────┘                        │
          │ YES                            │
          ▼                                │
┌─────────────────┐    N≥50      ┌─────────┴───────┐
│ Element Count   │─────────────►│ Hybrid          │
│ Threshold       │              │ Processing      │
│ Check           │              └─────────┬───────┘
└─────────┬───────┘                        │
          │ N<50                           │
          ▼                                │
┌─────────────────┐                        │
│ Direct Analysis │                        │
│ Processing      │                        │
└─────────┬───────┘                        │
          │                                │
          └────────────────────────────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ Execute Selected│
                  │ Strategy        │
                  └─────────────────┘
```

### Hybrid Processing Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│                    Hybrid Processing Flow                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ 1. ELEMENT CLASSIFICATION                                      │
│    ┌─────────────────────────────────────────────────────────┐ │
│    │ ElementClassifier.classifyBatch()                       │ │
│    │                                                         │ │
│    │ Critical Elements:           Bulk Elements:            │ │
│    │ • High z-index overlays     • Standard div elements    │ │
│    │ • Script-heavy elements     • Simple content blocks    │ │
│    │ • Interactive overlays      • Static advertisements    │ │
│    │ • Suspicious iframes        • Background elements      │ │
│    └─────────────┬───────────────────────┬─────────────────┘ │
│                  │                       │                   │
│                  ▼                       ▼                   │
│ 2. PARALLEL PROCESSING                                        │
│    ┌─────────────────────────────────────────────────────────┐ │
│    │                Promise.all()                            │ │
│    │                                                         │ │
│    │ ┌─────────────────┐       ┌─────────────────┐          │ │
│    │ │ Bulk Strategy   │       │ Real-time       │          │ │
│    │ │                 │       │ Strategy        │          │ │
│    │ │ • Snapshot      │       │ • Direct        │          │ │
│    │ │   creation      │       │   analysis      │          │ │
│    │ │ • Concurrent    │       │ • Timeout       │          │ │
│    │ │   analysis      │       │   protection    │          │ │
│    │ │ • Batch         │       │ • Individual    │          │ │
│    │ │   removal       │       │   removal       │          │ │
│    │ └─────────────────┘       └─────────────────┘          │ │
│    └─────────────┬───────────────────────┬─────────────────┘ │
│                  │                       │                   │
│                  └───────────┬───────────┘                   │
│                              │                               │
│                              ▼                               │
│ 3. RESULT AGGREGATION                                        │
│    ┌─────────────────────────────────────────────────────────┐ │
│    │ • Combine removal counts                                │ │
│    │ • Merge performance metrics                            │ │
│    │ • Update statistics                                    │ │
│    │ • Log comprehensive results                            │ │
│    └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Bulk Processing Optimization

```
┌─────────────────────────────────────────────────────────────────┐
│                      Bulk Processing Pipeline                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────────────┐              ┌─────────────────┐           │
│ │ Bulk Elements   │              │ Snapshot        │           │
│ │ Array           │─────────────►│ Creation        │           │
│ │                 │              │ (Single Layout  │           │
│ │ [el1,el2,...]   │              │ Calculation)    │           │
│ └─────────────────┘              └─────────┬───────┘           │
│                                            │                   │
│                                            ▼                   │
│                                  ┌─────────────────┐           │
│                                  │ Snapshot        │           │
│                                  │ Filtering       │           │
│                                  │                 │           │
│                                  │ • Size check    │           │
│                                  │ • Visibility    │           │
│                                  │ • Connection    │           │
│                                  │ • Error filter  │           │
│                                  └─────────┬───────┘           │
│                                            │                   │
│                                            ▼                   │
│                                  ┌─────────────────┐           │
│                                  │ Concurrent      │           │
│                                  │ Analysis        │           │
│                                  │                 │           │
│                                  │ Promise.all([   │           │
│                                  │  analyze(s1),   │           │
│                                  │  analyze(s2),   │           │
│                                  │  analyze(s3)    │           │
│                                  │ ])              │           │
│                                  └─────────┬───────┘           │
│                                            │                   │
│                                            ▼                   │
│                                  ┌─────────────────┐           │
│                                  │ Batch Removal   │           │
│                                  │ Decision        │           │
│                                  │                 │           │
│                                  │ • Filter by     │           │
│                                  │   confidence    │           │
│                                  │ • Validate      │           │
│                                  │   snapshots     │           │
│                                  │ • Execute       │           │
│                                  │   removals      │           │
│                                  └─────────────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

## Layer 3: Element Classification & Snapshot Management

**Files**: `src/scripts/modules/ElementClassifier.js`, `src/scripts/modules/SnapshotManager.js`

This layer provides intelligent element categorization and efficient state management:

### Classification Algorithm

```
┌─────────────────────────────────────────────────────────────────┐
│                    Element Classification Logic                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────────────┐              ┌─────────────────┐           │
│ │ Element Input   │              │ Style Analysis  │           │
│ │                 │─────────────►│                 │           │
│ │ • TagName       │              │ • Position      │           │
│ │ • Classes       │              │ • Z-index       │           │
│ │ • Attributes    │              │ • Dimensions    │           │
│ │ • Content       │              │ • Visibility    │           │
│ └─────────────────┘              └─────────┬───────┘           │
│                                            │                   │
│                                            ▼                   │
│                                  ┌─────────────────┐           │
│                                  │ Critical        │           │
│                                  │ Indicators      │           │
│                                  │                 │           │
│                                  │ ✓ z-index≥1000 │           │
│                                  │ ✓ position:fixed│           │
│                                  │ ✓ width>80%     │           │
│                                  │ ✓ height>80%    │           │
│                                  │ ✓ script-heavy  │           │
│                                  │ ✓ event handlers│           │
│                                  └─────────┬───────┘           │
│                                            │                   │
│                    ┌───────────────────────┼───────────────────┐
│                    │                       │                   │
│                    ▼                       ▼                   │
│          ┌─────────────────┐     ┌─────────────────┐           │
│          │ CRITICAL        │     │ BULK            │           │
│          │ ELEMENTS        │     │ ELEMENTS        │           │
│          │                 │     │                 │           │
│          │ • Immediate     │     │ • Batch         │           │
│          │   processing    │     │   processing    │           │
│          │ • Real-time     │     │ • Optimized     │           │
│          │   analysis      │     │   analysis      │           │
│          │ • Timeout       │     │ • Snapshot      │           │
│          │   protection    │     │   based         │           │
│          └─────────────────┘     └─────────────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

### Snapshot Management System

```
┌─────────────────────────────────────────────────────────────────┐
│                     Snapshot Creation Process                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────────────┐              ┌─────────────────┐           │
│ │ Elements Array  │              │ Single Layout   │           │
│ │ [el1,el2,...]   │─────────────►│ Read Pass       │           │
│ │                 │              │                 │           │
│ └─────────────────┘              │ getBoundingRect │           │
│                                  │ getComputedStyle│           │
│                                  │ Element props   │           │
│                                  └─────────┬───────┘           │
│                                            │                   │
│                                            ▼                   │
│                                  ┌─────────────────┐           │
│                                  │ Snapshot        │           │
│                                  │ Objects         │           │
│                                  │                 │           │
│                                  │ {               │           │
│                                  │   element: ref, │           │
│                                  │   width: num,   │           │
│                                  │   height: num,  │           │
│                                  │   position: str,│           │
│                                  │   zIndex: num,  │           │
│                                  │   display: str, │           │
│                                  │   visibility:str,│          │
│                                  │   opacity: str, │           │
│                                  │   isConnected:  │           │
│                                  │   timestamp: num│           │
│                                  │ }               │           │
│                                  └─────────┬───────┘           │
│                                            │                   │
│                                            ▼                   │
│                                  ┌─────────────────┐           │
│                                  │ Validation      │           │
│                                  │ & Filtering     │           │
│                                  │                 │           │
│                                  │ • Error check   │           │
│                                  │ • Size filter   │           │
│                                  │ • Visibility    │           │
│                                  │ • Connection    │           │
│                                  │   status        │           │
│                                  └─────────────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

## Layer 4: Performance Optimization & Adaptive Tuning

**File**: `src/scripts/modules/PerformanceTracker.js`

This layer provides comprehensive performance monitoring and adaptive optimization:

### Performance Tracking Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                   Performance Monitoring System                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────────────┐              ┌─────────────────┐           │
│ │ Batch           │              │ Analysis        │           │
│ │ Performance     │              │ Performance     │           │
│ │                 │              │                 │           │
│ │ • Batch size    │              │ • Time per      │           │
│ │ • Process time  │              │   element       │           │
│ │ • Success rate  │              │ • Confidence    │           │
│ │ • Element count │              │   distribution  │           │
│ └─────────┬───────┘              └─────────┬───────┘           │
│           │                                │                   │
│           └──────────────┬─────────────────┘                   │
│                          │                                     │
│                          ▼                                     │
│                ┌─────────────────┐                             │
│                │ Adaptive Batch  │                             │
│                │ Sizing          │                             │
│                │                 │                             │
│                │ Target: 16ms    │                             │
│                │ (60 FPS budget) │                             │
│                │                 │                             │
│                │ If slow:        │                             │
│                │ size *= 0.8     │                             │
│                │                 │                             │
│                │ If fast:        │                             │
│                │ size *= 1.2     │                             │
│                └─────────┬───────┘                             │
│                          │                                     │
│                          ▼                                     │
│                ┌─────────────────┐                             │
│                │ Optimization    │                             │
│                │ Recommendations │                             │
│                │                 │                             │
│                │ • Batch tuning  │                             │
│                │ • Rule weights  │                             │
│                │ • Memory alerts │                             │
│                │ • Timeout adj.  │                             │
│                └─────────────────┘                             │
└─────────────────────────────────────────────────────────────────┘
```

### Adaptive Optimization Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Optimization Decision Tree                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────────────┐                                           │
│ │ Performance     │                                           │
│ │ Measurement     │                                           │
│ └─────────┬───────┘                                           │
│           │                                                    │
│           ▼                                                    │
│ ┌─────────────────┐    >16ms    ┌─────────────────┐           │
│ │ Frame Budget    │─────────────►│ SLOW PATH       │           │
│ │ Check           │              │                 │           │
│ │ (Target: 16ms)  │              │ • Reduce batch  │           │
│ └─────────┬───────┘              │   size          │           │
│           │ ≤8ms                 │ • Increase      │           │
│           ▼                      │   timeouts      │           │
│ ┌─────────────────┐              │ • Simplify      │           │
│ │ FAST PATH       │              │   rules         │           │
│ │                 │              └─────────────────┘           │
│ │ • Increase      │                                           │
│ │   batch size    │                                           │
│ │ • Reduce        │                                           │
│ │   timeouts      │                                           │
│ │ • Enable more   │                                           │
│ │   complex rules │                                           │
│ └─────────────────┘                                           │
│                                                                 │
│ ┌─────────────────┐    >50MB    ┌─────────────────┐           │
│ │ Memory Usage    │─────────────►│ MEMORY ALERT    │           │
│ │ Monitoring      │              │                 │           │
│ │                 │              │ • Clear caches  │           │
│ └─────────┬───────┘              │ • Force GC      │           │
│           │ <20MB                │ • Reduce        │           │
│           ▼                      │   tracking      │           │
│ ┌─────────────────┐              └─────────────────┘           │
│ │ NORMAL          │                                           │
│ │ OPERATION       │                                           │
│ └─────────────────┘                                           │
└─────────────────────────────────────────────────────────────────┘
```

## Complete Workflow: End-to-End Pattern Detection

```
┌─────────────────────────────────────────────────────────────────┐
│                    Complete Pattern Rules Flow                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ 1. INITIALIZATION                                              │
│    ├─ Load extension settings                                  │ 
│    ├─ Check domain whitelist status                           │
│    ├─ Initialize AdDetectionEngine                            │
│    ├─ Setup HybridProcessor                                    │
│    └─ Initialize PerformanceTracker                           │
│                          │                                     │
│                          ▼                                     │
│ 2. EXECUTION TRIGGER                                          │
│    ├─ User navigates to page                                   │
│    ├─ DOM content loaded                                       │
│    ├─ MutationObserver detects changes                        │
│    └─ Manual rule execution request                           │
│                          │                                     │
│                          ▼                                     │
│ 3. STRATEGY SELECTION                                         │
│    ├─ Check pattern rules enabled                             │
│    ├─ Validate dependencies available                         │
│    ├─ Count suspicious elements                               │
│    └─ Choose: Hybrid vs Legacy vs Skip                        │
│                          │                                     │
│                          ▼                                     │
│ 4. ELEMENT PROCESSING (if Hybrid selected)                   │
│    ├─ Query suspicious elements                               │
│    ├─ ElementClassifier.classifyBatch()                      │
│    ├─ Split into Critical + Bulk arrays                      │
│    └─ Execute Promise.all([bulk, critical])                  │
│                          │                                     │
│                          ▼                                     │
│ 5. PARALLEL ANALYSIS                                          │
│    ┌─ BULK BRANCH:                                            │
│    │  ├─ Create snapshots                                     │
│    │  ├─ Filter & validate                                    │
│    │  ├─ Concurrent analysis                                  │
│    │  └─ Batch removal                                        │
│    └─ CRITICAL BRANCH:                                        │
│       ├─ Real-time analysis                                   │
│       ├─ Timeout protection                                   │
│       ├─ Individual removal                                   │
│       └─ Performance tracking                                 │
│                          │                                     │
│                          ▼                                     │
│ 6. RESULT AGGREGATION                                         │
│    ├─ Combine removal counts                                  │
│    ├─ Update domain statistics                                │
│    ├─ Store performance metrics                               │
│    └─ Log execution summary                                   │
│                          │                                     │
│                          ▼                                     │
│ 7. OPTIMIZATION FEEDBACK                                      │
│    ├─ Update adaptive batch sizing                            │
│    ├─ Adjust confidence thresholds                            │
│    ├─ Generate performance recommendations                     │
│    └─ Trigger cleanup if needed                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Integration with JustUI Controller

### Controller Initialization Sequence

```
JustUIController.initialize()
│
├─ 1. Load settings (including patternRulesEnabled)
├─ 2. Setup message listeners  
├─ 3. Check if domain is whitelisted
│     │
│     ├─ If WHITELISTED: Skip pattern rules
│     └─ If NOT WHITELISTED: Continue
│
├─ 4. Initialize AdDetectionEngine
│     ├─ Load detection rules configuration
│     ├─ Setup weighted scoring system
│     └─ Initialize multilingual patterns
│
├─ 5. Initialize HybridProcessor
│     ├─ Setup ElementClassifier
│     ├─ Initialize SnapshotManager
│     ├─ Configure PerformanceTracker
│     └─ Setup bulk/critical processing
│
└─ 6. Start protection systems (if domain not whitelisted)
      ├─ Activate MutationObserver
      ├─ Setup rule execution callbacks
      └─ Begin initial pattern scan
```

### Message Flow Between Components

```
Popup ◄─────────► Background Script ◄─────────► Content Script
  │                        │                          │
  │                        │                          ▼
  │                        │                 ┌─────────────────┐
  │                        │                 │JustUIController │
  │                        │                 │   (Main)        │
  │                        │                 └─────────┬───────┘
  │                        │                           │
  │                        │                           ▼
  │                        │                 ┌─────────────────┐
  │                        │                 │ executePattern  │
  │                        │                 │ Rules()         │
  │                        │                 └─────────┬───────┘
  │                        │                           │
  │                        │                           ▼
  │                        │                 ┌─────────────────┐
  │                        │                 │ HybridProcessor │
  │                        │                 │ AdDetection     │
  │                        │                 │ Engine          │
  │                        │                 └─────────────────┘
  │                        │                          │
  └────────────────────────┼──────────────────────────┘
                           │
                    ┌─────────────────┐
                    │ Chrome Storage  │
                    │                 │
                    │ • isActive      │
                    │ • pattern       │
                    │   RulesEnabled  │
                    │ • domainStats   │
                    │ • settings      │
                    └─────────────────┘

Message Types:
├─ storageChanged (patternRulesEnabled)
├─ whitelistUpdated  
├─ executeRules (triggers pattern detection)
├─ getStats (returns performance metrics)
└─ updateSettings (rule configuration)
```

## Error Handling & Edge Cases

### Detection Engine Error Handling

```
┌─────────────────┐
│ Rule Execution  │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐      FAIL     ┌─────────────────┐
│ Individual Rule │─────────────►│ Log Warning     │
│ Try/Catch       │              │ Continue Others │
└─────────┬───────┘              └─────────────────┘
          │ SUCCESS
          ▼
┌─────────────────┐
│ Add to Result   │
│ Array           │
└─────────────────┘
```

### Performance Protection

```
┌─────────────────────────────────────────────────────────────────┐
│                    Performance Protection System               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Timeout Protection:                                             │
│ ├─ Individual element analysis: 50ms max                       │
│ ├─ Critical element batch: 30ms per element                   │
│ ├─ Total execution: Adaptive based on element count           │
│ └─ Fallback: Skip to next element on timeout                  │
│                                                                 │
│ Memory Protection:                                              │
│ ├─ Element reference cleanup after processing                 │
│ ├─ WeakMap usage for temporary references                     │
│ ├─ Periodic performance metric cleanup                        │
│ └─ Forced GC on memory threshold breach                       │
│                                                                 │
│ CPU Protection:                                                 │
│ ├─ Adaptive batch sizing (5-100 elements)                     │
│ ├─ Frame budget respect (16ms target)                         │
│ ├─ RequestIdleCallback integration                            │
│ └─ Cooperative scheduling with yielding                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Cleanup & Memory Management

```
┌─────────────────────────────────────────────────────────────────┐
│                    Cleanup Lifecycle                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Trigger Events:                                                 │
│ ├─ beforeunload / pagehide                                     │
│ ├─ Extension context invalidation                              │
│ ├─ Navigation away from page                                   │
│ └─ Extension disable/reload                                     │
│                          │                                     │
│                          ▼                                     │
│ ┌─────────────────┐                                           │
│ │ performCleanup()│                                           │
│ └─────────┬───────┘                                           │
│           │                                                    │
│           ▼                                                    │
│ ┌─────────────────┐                                           │
│ │ AdDetection     │                                           │
│ │ Engine.cleanup()│                                           │
│ │                 │                                           │
│ │ • Clear rules   │                                           │
│ │ • Reset state   │                                           │
│ │ • Null refs     │                                           │
│ └─────────┬───────┘                                           │
│           │                                                    │
│           ▼                                                    │
│ ┌─────────────────┐                                           │
│ │ Hybrid          │                                           │
│ │ Processor       │                                           │
│ │ .cleanup()      │                                           │
│ │                 │                                           │
│ │ • Clear caches  │                                           │
│ │ • Remove refs   │                                           │
│ │ • Stop timers   │                                           │
│ └─────────┬───────┘                                           │
│           │                                                    │
│           ▼                                                    │
│ ┌─────────────────┐                                           │
│ │ Performance     │                                           │
│ │ Tracker         │                                           │
│ │ .cleanup()      │                                           │
│ │                 │                                           │
│ │ • Reset metrics │                                           │
│ │ • Clear history │                                           │
│ │ • Stop intervals│                                           │
│ └─────────────────┘                                           │
└─────────────────────────────────────────────────────────────────┘
```

## Performance Considerations

### Processing Efficiency

```
┌─────────────────────────────────────────────────────────────────┐
│                       Optimization Layers                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ 1. EARLY FILTERING                                             │
│    ├─ Whitelist check (O(1) cache lookup)                     │
│    ├─ Element count threshold (skip if <5 elements)           │
│    ├─ Rule enabled checks (skip disabled categories)          │
│    └─ Context validation (skip if extension invalid)          │
│                                                                 │
│ 2. BATCH OPTIMIZATION                                          │
│    ├─ Single layout read pass (avoid layout thrashing)        │
│    ├─ Concurrent analysis (Promise.all parallelization)       │
│    ├─ Adaptive batch sizing (5-100 elements per batch)        │
│    └─ Memory-efficient snapshots (minimal data retention)     │
│                                                                 │
│ 3. ALGORITHM EFFICIENCY                                        │
│    ├─ Early rule exit (fail-fast on impossible matches)       │
│    ├─ Weighted scoring (prioritize high-value rules)          │
│    ├─ Regex compilation caching                               │
│    └─ DOM query optimization (specific selectors)             │
│                                                                 │
│ 4. MEMORY MANAGEMENT                                           │
│    ├─ WeakMap references (automatic GC)                       │
│    ├─ Streaming processing (no large arrays)                  │
│    ├─ Immediate cleanup (process-and-discard)                 │
│    └─ Bounded cache sizes (LRU eviction)                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Memory Usage Patterns

```
Memory Allocation Strategy:

├─ Minimal element references (process immediately)
├─ Snapshot-based analysis (avoid DOM re-reads)  
├─ Bounded performance history (rolling windows)
├─ WeakMap usage for element tracking
├─ Immediate disposal after processing
└─ Periodic cleanup enforcement
```

## Security Model

### Safe Element Analysis

```
Element Processing Security:
┌─────────────────┐
│ Element Input   │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Null/Undefined │
│ Validation      │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ DOM Connection  │
│ Check           │
│ (isConnected)   │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Safe Property   │
│ Access          │
│ (try/catch)     │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Analysis        │
│ Execution       │
└─────────────────┘
```

### XSS Prevention

```
Content Analysis Security:
├─ No innerHTML reading without sanitization
├─ Safe attribute access with fallbacks
├─ Escaped string processing for URLs
├─ No eval() or dynamic code execution
├─ Sandboxed regex execution
└─ Content Security Policy compliance
```

## Statistics & Analytics

### Comprehensive Metrics Collection

```
┌─────────────────────────────────────────────────────────────────┐
│                      Metrics Dashboard                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Execution Metrics:                                              │
│ ├─ Total pattern rule executions                               │
│ ├─ Hybrid vs legacy strategy usage                            │
│ ├─ Average execution time per strategy                        │
│ ├─ Elements processed per second (throughput)                 │
│ └─ Success/failure rates                                       │
│                                                                 │
│ Detection Metrics:                                              │
│ ├─ Total elements analyzed                                     │
│ ├─ Elements removed by confidence level                       │
│ ├─ Rule effectiveness (removal rate per rule)                 │
│ ├─ False positive estimation                                   │
│ └─ Detection accuracy trends                                   │
│                                                                 │
│ Performance Metrics:                                            │
│ ├─ Memory usage patterns                                       │
│ ├─ CPU utilization                                             │
│ ├─ Frame budget adherence                                      │
│ ├─ Cache hit/miss ratios                                       │
│ └─ Optimization effectiveness                                   │
│                                                                 │
│ User Experience Metrics:                                        │
│ ├─ Page load impact                                            │
│ ├─ User interaction latency                                    │
│ ├─ Extension overhead measurement                              │
│ └─ Quality of life improvements                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

This comprehensive workflow documentation provides a detailed overview of the Pattern Rules system's AI-powered detection engine, showing how each layer works together to provide intelligent ad detection while maintaining optimal performance through adaptive optimization and robust error handling.