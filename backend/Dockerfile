FROM python:3.11-slim

WORKDIR /app

# Установка системных зависимостей
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Копирование файлов зависимостей
COPY requirements.txt .

# Установка Python зависимостей
RUN pip install --no-cache-dir -r requirements.txt

# Копирование всего кода в /app/backend для корректных импортов backend.app.*
COPY . /app/backend/

# Обеспечиваем, что пакет 'backend' виден питону
ENV PYTHONPATH=/app

# Открытие порта
EXPOSE 8000

# Рабочая директория внутри пакета backend
WORKDIR /app/backend

# Запуск приложения
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
