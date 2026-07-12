# Social Media Website

A full-stack application that visualizes temperature data in real time 
using a RESTful Django backend and a React + CSS + Tailwind frontend.

.

##🔧 Installation
## 1. Clone the repo:
```python
git clone https://github.com/NitayDas/social-media.git
```

## 2. Backend Setup (Django)

a. Create virtual env and activate (Optiontal):

```python
python -m venv venv
```

Activate:
```python
# On Windows
cd venv/Scripts/activate

# On Linux/macOS
source venv/bin/activate
```


b. Install dependencies:
   
```python
cd server
pip install -r requirements.txt
```


c. Run migrations:
   
```python
python manage.py makemigrations
python manage.py migrate
```


d. Start server:
   
```python
python manage.py runserver
```

## 3. Frontend Setup (React)
```
cd client
npm install
npm run dev
```
