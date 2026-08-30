# 🤖 AI & Machine Learning Pipeline Blueprint

The backend implements 5 deterministic & statistical AI modules:

### 1. NLP Domain Classifier (`app/ai/classifier.py`)
- Analyzes grievance title, voice transcript, and description.
- Computes term-frequency weighting against Indian ministry domain taxonomies.
- Outputs recommended nodal ministry and confidence score.

### 2. Geo-Spatial Deduplicator (`app/ai/deduplicator.py`)
- Executes Haversine distance clustering ($< 500\text{m}$) combined with cosine text similarity.
- Groups redundant citizen complaints into unified high-impact incident clusters.

### 3. Priority & Severity Engine (`app/ai/prioritizer.py`)
- Evaluates public safety triggers (fire, collapsed road, hospital accessibility, contamination).
- Adjusts severity based on cluster ticket density and duration.

### 4. University Department Matcher (`app/ai/university_matcher.py`)
- Maps civic problems to academic departments (e.g. Water Contamination $\rightarrow$ Civil & Environmental Engineering Labs).
- Ranks top institutional contenders for challenge adoption.

### 5. Industry CSR Matcher (`app/ai/industry_matcher.py`)
- Connects verified national challenges with corporate CSR priority sectors (Section 135 Companies Act).
