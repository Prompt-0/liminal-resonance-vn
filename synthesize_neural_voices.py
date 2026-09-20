import os
import asyncio
import edge_tts
from gtts import gTTS

OUTPUT_DIR = "/root/Projects/liminal-resonance-vn/public/audio/voice"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# 23 Dialogues from Chapter 1 Script
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

# Character Voice Profiles
PROFILES = {
    "isaac": {
        "voice": "en-US-ChristopherNeural",
        "rate": "-3%",
        "pitch": "+0Hz",
        "volume": "+0%"
    },
    "mercer": {
        "voice": "en-US-JennyNeural",
        "rate": "-8%",
        "pitch": "-4Hz",
        "volume": "+10%"
    },
    "cole": {
        "voice": "en-US-EricNeural",
        "rate": "+5%",
        "pitch": "-2Hz",
        "volume": "+5%"
    },
    "system": {
        "voice": "en-US-GuyNeural",
        "rate": "+0%",
        "pitch": "+0Hz",
        "volume": "-5%"
    }
}

async def generate_voice(node_id, char_id, text):
    cfg = PROFILES.get(char_id, PROFILES["system"])
    out_path = os.path.join(OUTPUT_DIR, f"{node_id}.mp3")
    try:
        # Edge Neural Voice synthesis
        comm = edge_tts.Communicate(text, cfg["voice"], rate=cfg["rate"], pitch=cfg["pitch"], volume=cfg["volume"])
        await comm.save(out_path)
        print(f"Generated neural voice: {out_path} [{char_id}]")
    except Exception as e:
        print(f"Fallback to gTTS for {node_id}: {e}")
        tts = gTTS(text=text, lang='en', slow=False)
        tts.save(out_path)

async def main():
    print("Synthesizing high-fidelity neural voice files...")
    tasks = [generate_voice(n, c, t) for n, c, t in DIALOGUES]
    await asyncio.gather(*tasks)
    print("Voice synthesis complete!")

if __name__ == "__main__":
    asyncio.run(main())
