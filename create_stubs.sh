#!/bin/bash

# Создаём все недостающие компоненты-заглушки

# Иконки
icons=(
  "BookOpenIcon"
  "CodeBracketIcon"
  "PhotoIcon"
  "ArrowPathIcon"
  "SpinnerIcon"
  "TrashIcon"
  "DocumentArrowDownIcon"
  "DownloadIcon"
  "BriefcaseIcon"
  "LightBulbIcon"
  "ChartBarIcon"
  "CurrencyDollarIcon"
  "RocketLaunchIcon"
  "ShoppingCartIcon"
  "EnvelopeIcon"
  "ShareIcon"
  "PencilIcon"
  "EyeIcon"
)

for icon in "${icons[@]}"; do
  echo "export const $icon = () => null;" > components/icons/$icon.tsx
done

# Компоненты
components=(
  "CodeBlock"
  "TimelineStepper"
  "PublicationLog"
  "ErrorLog"
  "ConfirmationModal"
  "ErrorDisplay"
  "WorkflowStepper"
)

for comp in "${components[@]}"; do
  echo "export const $comp = () => null;" > components/$comp.tsx
done

echo "✅ Все заглушки созданы"
