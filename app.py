import streamlit as st
import pandas as pd
import joblib
from datetime import datetime, date

st.set_page_config(
    page_title="Social Media Engagement Predictor",
    page_icon="📊",
    layout="wide",
)

st.markdown("""
<style>
  :root {
    --primary: #FF6E40;
    --secondary: #FF8A65;
    --bg: #121212;
    --text: #E0E0E0;
    --font: 'Segoe UI', sans-serif;
  }

  body, .stApp {
    background-color: var(--bg);
    color: var(--text);
    font-family: var(--font);
  }

  .main .block-container {
    padding: 2rem;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  h1, h2, h3 {
    color: var(--primary);
    margin-bottom: 0.5rem;
    text-align: center;
  }

  .stButton>button {
    background-color: var(--primary);
    color: #121212;
    font-weight: bold;
    padding: 0.75rem;
    width: 100%;
    max-width: 300px;
    margin: 1.5rem auto 0;
    border: none;
    border-radius: 8px;
  }
  .stButton>button:hover {
    background-color: var(--secondary);
  }

  .result-box {
    background-color: #1e1e1e;
    padding: 1.5rem;
    border-radius: 12px;
    text-align: center;
    margin-top: 2rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  }

  .result-value {
    font-size: 3rem;
    font-weight: bold;
    color: var(--primary);
  }

  .tagline {
    font-size: 1.1rem;
    color: #aaaaaa;
    text-align: center;
  }

  .sidebar-card {
    background: #1E1E1E;
    border-radius: 8px;
    padding: 1rem;
    margin: 1rem 0;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  }
</style>
""", unsafe_allow_html=True)

st.sidebar.markdown("""
<div class="sidebar-card">
<h3 style="color: #FF6E40;">About</h3>
<p>Predict social-media engagement based on:</p>
<ul>
  <li><strong>Platform</strong> (Facebook, Instagram, X)</li>
  <li><strong>Post type</strong> (Carousel, Image, Poll, Text, Video)</li>
  <li><strong>Trending status</strong></li>
  <li><strong>Scheduled date & time</strong></li>
</ul>
</div>
""", unsafe_allow_html=True)

st.sidebar.markdown("""
<div class="sidebar-card">
<h3 style="color: #FF6E40;">Contact</h3>
<p>📧 <strong>Gmail:</strong> shrizzites@gmail.com</p>
</div>
""", unsafe_allow_html=True)

@st.cache_resource
def load_model():
    return joblib.load("final_model.joblib")

model = load_model()

st.title("📊 Social Media Engagement Predictor")
st.markdown('<p class="tagline">Plan your posts smartly for maximum reach.</p>', unsafe_allow_html=True)

with st.form("prediction_form"):
    st.markdown("### ✏️ Fill in Post Details")
    center_col = st.columns(3)[1]

    with center_col:
        platform = st.selectbox("📱 Platform", ['Facebook', 'Instagram', 'X'])
        post_type = st.selectbox("🖼️ Post Type", ['Carousel', 'Image', 'Poll', 'Text', 'Video'])
        trending = st.selectbox("🔥 Trending", ['Maybe', 'No', 'Yes'])
        post_date = st.date_input("📅 Post Date", value=date.today())
        post_time = st.time_input("🕒 Post Time", value=datetime.now().time().replace(second=0, microsecond=0))
        submitted = st.form_submit_button("🚀 Predict Engagement")

def time_of_day(h):
    if 5 <= h < 12: return 'morning'
    elif 12 <= h < 17: return 'afternoon'
    elif 17 <= h < 21: return 'evening'
    else: return 'night'

if submitted:
    try:
        hour = post_time.hour
        minute = post_time.minute
        dt = datetime.combine(post_date, datetime.min.time().replace(hour=hour, minute=minute))
        weekday = dt.weekday()
        is_weekend = int(weekday >= 5)
        tod = time_of_day(hour)

        feats = {
            'platform_Instagram': int(platform == 'Instagram'),
            'platform_Twitter': int(platform == 'X'),
            'post_type_image': int(post_type == 'image'),
            'post_type_poll': int(post_type == 'poll'),
            'post_type_text': int(post_type == 'text'),
            'post_type_video': int(post_type == 'video'),
            'trending_no': int(trending == 'no'),
            'trending_yes': int(trending == 'yes'),
            'month': dt.month,
            'day': dt.day,
            'weekday': weekday,
            'hour': hour,
            'minute': minute,
            'is_weekend': is_weekend,
            'time_of_day_evening': int(tod == 'evening'),
            'time_of_day_morning': int(tod == 'morning'),
            'time_of_day_night': int(tod == 'night'),
        }

        X = pd.DataFrame([feats])
        pred = model.predict(X)[0]

        max_engagement = 5000
        percent = round((pred / max_engagement) * 100)
        percent = max(0, min(100, percent))

        st.markdown(f"""
<div class="result-box">
  <div class="result-value">{percent:.0f}%</div>
  <div class="tagline">Predicted Engagement Rate</div>
</div>
""", unsafe_allow_html=True)

        if percent > 75:
            st.success("✨ High engagement expected! Schedule it!")
        elif percent > 50:
            st.info("👍 Moderate engagement. Worth posting!")
        else:
            st.warning("⚠️ Low engagement. Consider changing timing or content.")

    except Exception as err:
        st.error(f"Prediction error: {err}")
