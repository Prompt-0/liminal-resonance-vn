"""
Gemini Live / Gemini 2.0 Multimodal Voice Acting Pipeline
Synthesizes dramatic character voice lines with emotional acting, breath,
and human nuance using Gemini 2.0 Flash Audio Output.
"""

import os
import sys
from google import genai
from google.genai import types

API_KEY = os.environ.get("GEMINI_API_KEY")

if not API_KEY:
    print("\n[!] GEMINI_API_KEY environment variable is not set.")
    print("To generate authentic Gemini Live emotional voice acting:")
    print("  export GEMINI_API_KEY='your_api_key_here'")
    print("  python3 generate_gemini_voices.py\n")
    sys.exit(1)

client = genai.Client(api_key=API_KEY)
OUTPUT_DIR = "/root/Projects/liminal-resonance-vn/public/audio/voice"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Character Voice Acting Prompts & Gemini Voices
# Available Gemini 2.0 voices: "Puck", "Charon", "Kore", "Fenrir", "Aoede"
CHAR_CONFIGS = {
    "isaac": {
        "voice": "Charon",
        "system_instruction": "You are Dr. Isaac Vance, an exhausted, terrified audio archivist in a 1980s bunker. Act with realistic human emotions: tired sighs, tense breathing, trembling quiet voice, and high dramatic intensity. Do not sound like a standard assistant. Voice act this exact line with deep psychological horror immersion:"
    },
    "mercer": {
        "voice": "Aoede",
        "system_instruction": "You are Dr. Elena Mercer on a 1987 archival tape. Speak with a hypnotic, eerie, uncanny calm, subtle intimate breathing, and a spine-chilling fourth-wall delivery. Voice act this exact line:"
    },
    "cole": {
        "voice": "Fenrir",
        "system_instruction": "You are Supervisor Arthur Cole, a strict, cold, authoritarian facility director on an intercom. Speak with commanding urgency, crisp pacing, and sharp authoritative vocal tone. Voice act this exact line:"
    },
    "system": {
        "voice": "Puck",
        "system_instruction": "You are a monotone 1980s computerized facility warning system. Read this text cleanly and methodically:"
    }
}

DIALOGUES = [
    ("prologue_01", "isaac", "02:14 AM. Sub-level 4 smells of iron oxide and damp concrete. The reel-to-reel deck hums on the metal workbench."),
    ("prologue_02", "isaac", "The box label reads: Project Morpheus. Acoustic Isolation Log 09. Dr. Elena Mercer. October 14, 1987."),
    ("prologue_03", "isaac", "The magnetic tape ribbon looks brittle, discolored by thirty years of stagnant air. Beside the deck, the intercom speaker crackles."),
    ("prologue_04", "cole", "Vance. Confirm telemetry connection. The upper deck monitors are receiving your audio feed. Keep the playback gain under negative four decibels."),
    ("prologue_05", "isaac", "Understood, Cole. Loading the spool now. Tape tension calibrated."),
    ("scene1_inspect", "isaac", "Under the magnifying lamp, the magnetic oxide contains microscopic scoring. Someone etched tiny alphanumeric coordinates directly into the tape ribbon."),
    ("scene2_tape_start", "system", "Tape transport engaged. Speed: 19 centimeters per second. Channel A and B active."),
    ("scene2_tape_voice_01", "mercer", "Log entry zero-nine. Date: October fourteenth, nineteen eighty-seven. Acoustic pressure tests inside anechoic chamber four."),
    ("scene2_tape_voice_02", "mercer", "The silence here is not empty. When ambient decibels drop below negative twenty, the brain compensates by generating its own carrier frequency."),
    ("scene2_tape_voice_03", "mercer", "Listen to the tone, Isaac. You are sitting with your spine curved toward the VU meter. Your left thumb rests on the pinch roller."),
    ("scene2_isaac_shock", "isaac", "My hand jerks back from the machine. The room air feels suddenly freezing. How does a thirty-year-old tape know my posture?"),
    ("scene2_cole_intercom", "cole", "Vance, your biometric pulse telemetry just spiked to one hundred and ten BPM. What did you hear on that channel?"),
    ("scene3_cole_skeptic", "cole", "Auditory pareidolia under sleep deprivation. The human brain maps familiar phonemes onto raw noise. Do not stop the tape, Vance. Let it run to the end marker."),
    ("scene3_conceal_branch", "isaac", "I keep my voice steady. Cole is watching telemetry dials upstairs, not listening to the tape audio. He does not hear what she is saying."),
    ("scene3_mercer_resumes", "mercer", "Arthur is checking his chronometer right now, Isaac. In four minutes, the automated containment interlocks engage on Sub-level 4."),
    ("scene3_mercer_instruction", "mercer", "Turn the equalization knob on channel two to four hundred and thirty-two Hertz. Match my resonance, or the doorway locks from the outside."),
    ("scene4_harmonic_shift", "isaac", "I turn the brass dial to 432 Hertz. The speaker hum drops into a low, chest-vibrating fundamental tone. The fluorescent light tubes flicker and hum in perfect unison with the tape."),
    ("scene4_chamber_revealed", "isaac", "The heavy steel door at the end of the corridor, the entrance to Anechoic Chamber Four, stands open. Inside, an old microphone stand sits under a single amber spotlight."),
    ("scene4_escape_attempt", "cole", "VANCE! Telemetry shows signal attenuation! Step away from the console! The containment seal has initiated!"),
    ("scene5_final_choice", "isaac", "The sirens howl behind the bulkhead walls. Static pours from the tape deck like pouring water. The moment of decision is here."),
    ("ending_resonance_node", "mercer", "I place the headphones on my ears and breathe into the microphone. Log entry ten. Date: Today. The listener has arrived. We are now transmitting together."),
    ("ending_lucid_node", "isaac", "The heavy steel door gives with a groan of metal. I wrench the cassette spool from the machine and sprint up the concrete staircase into the cold, pale morning mist."),
    ("ending_sever_node", "isaac", "Metal shears. Sparks arc across the vacuum tubes. The static screams inside my skull, louder than any sound the room could hold, until the dark turns absolute.")
]

def synthesize_gemini_audio(node_id, char_id, text):
    cfg = CHAR_CONFIGS.get(char_id, CHAR_CONFIGS["system"])
    out_file = os.path.join(OUTPUT_DIR, f"{node_id}.mp3")
    
    prompt = f"{cfg['system_instruction']}\n\n\"{text}\""
    
    print(f"Generating Gemini Voice for {node_id} ({char_id}) using voice '{cfg['voice']}'...")
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_modalities=["AUDIO"],
            speech_config=types.SpeechConfig(
                voice_config=types.VoiceConfig(
                    prebuilt_voice_config=types.PrebuiltVoiceConfig(
                        voice_name=cfg["voice"]
                    )
                )
            )
        )
    )
    
    # Extract audio bytes from response
    for part in response.candidates[0].content.parts:
        if part.inline_data and part.inline_data.mime_type.startswith("audio/"):
            with open(out_file, "wb") as f:
                f.write(part.inline_data.data)
            print(f" Saved: {out_file}")
            return True

    print(f"[-] No audio part returned for {node_id}")
    return False

if __name__ == "__main__":
    print(f"Beginning Gemini Live Voice Generation for {len(DIALOGUES)} lines...")
    success = 0
    for node_id, char_id, text in DIALOGUES:
        if synthesize_gemini_audio(node_id, char_id, text):
            success += 1
    print(f"\nDone! Successfully synthesized {success}/{len(DIALOGUES)} voice lines with Gemini 2.0.")
