# orcaAL

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/orcasound/orcaal/blob/master/LICENSE)

> Developed by Diego R. Saltijeral in 2020 and funded by the [Google Summer of Code program](https://summerofcode.withgoogle.com/). The binary classification model and the preprocessing script were developed by Kunal Mehta; the research about it is located in [this repo](https://github.com/orcasound/backend-of-active-learning).

OrcaAL is an active learning tool to help an orca detection model perform better. A machine learning algorithm can perform better with less training if it is allowed to choose the data from which it learns. The active learner poses queries in the form of unlabeled data instances to be labeled by a human annotator that already understands the nature of the problem.

The tool has been divided into different subprojects:

-   An API
-   The preprocessing of the data
-   Training and predicting with a Machine Learning model
-   A webapp

Visit each subproject to know more about it, and how to get started with it.

**Flowchart of how the tool works:**  
![flowchart](api/assets/flowchart.jpg)

**Architecture of the tool:**
![architecture](api/assets/architecture.png)

# Questions?

Ask GSoC-specific questions in the #GSoC channel of the [Orcasound Slack workspace](https://join.slack.com/t/orcasound/shared_invite/zt-bd1jk2q9-FjeWr3OzocDBwDgS0g1FdQ).

Discuss more general software and hardware development questions within the [Orcasound dev email distribution list](http://lists.orcasound.net/listinfo.cgi/dev-orcasound.net).

More questions about being a GSoC mentor or student? Check out the [GSoC mentor & student guides](https://google.github.io/gsocguides/).
