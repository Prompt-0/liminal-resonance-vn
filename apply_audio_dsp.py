import os
import subprocess
import glob

VOICE_DIR = "/root/Projects/liminal-resonance-vn/public/audio/voice"

# Character acoustic DSP filters
DSP_CHAINS = {
    # Isaac Vance: Close-mic intimate vocal warmth
    "isaac": "highpass=f=80, equalizer=f=3000:t=q:w=1.2:g=2.5, acompressor=threshold=-14dB:ratio=3:attack=5:release=80",
    
    # Dr. Elena Mercer (Tape 09): Magnetic tape degradation, warm tape-head resonant bump, subtle wow/flutter
    "mercer": "highpass=f=240, lowpass=f=5400, equalizer=f=3600:t=q:w=1.6:g=4.5, flanger=delay=3.5:depth=1.8:regen=22:width=75:speed=0.4, acompressor=threshold=-10dB:ratio=4:attack=8:release=120",
    
    # Supervisor Arthur Cole (Intercom): 1987 sub-level facility intercom speaker box
    "cole": "highpass=f=420, lowpass=f=3500, equalizer=f=1800:t=q:w=2.2:g=6.0, overdrive=2.0, volume=1.15",
    
    # System: Monochrome terminal
    "system": "highpass=f=300, lowpass=f=4500, equalizer=f=2400:t=q:w=1.5:g=3.0"
}

NODE_CHAR_MAP = {
    "prologue_01": "isaac",
    "prologue_02": "isaac",
    "prologue_03": "isaac",
    "prologue_04": "cole",
    "prologue_05": "isaac",
    "scene1_inspect": "isaac",
    "scene2_tape_start": "system",
    "scene2_tape_voice_01": "mercer",
    "scene2_tape_voice_02": "mercer",
    "scene2_tape_voice_03": "mercer",
    "scene2_isaac_shock": "isaac",
    "scene2_cole_intercom": "cole",
    "scene3_cole_skeptic": "cole",
    "scene3_conceal_branch": "isaac",
    "scene3_mercer_resumes": "mercer",
    "scene3_mercer_instruction": "mercer",
    "scene4_harmonic_shift": "isaac",
    "scene4_chamber_revealed": "isaac",
    "scene4_escape_attempt": "cole",
    "scene5_final_choice": "isaac",
    "ending_resonance_node": "mercer",
    "ending_lucid_node": "isaac",
    "ending_sever_node": "isaac"
}

for node_id, char_id in NODE_CHAR_MAP.items():
    src_file = os.path.join(VOICE_DIR, f"{node_id}.mp3")
    tmp_file = os.path.join(VOICE_DIR, f"{node_id}_processed.mp3")
    
    if not os.path.exists(src_file):
        continue
        
    filter_chain = DSP_CHAINS.get(char_id, DSP_CHAINS["system"])
    cmd = [
        "ffmpeg", "-y", "-i", src_file,
        "-af", filter_chain,
        "-b:a", "192k",
        tmp_file
    ]
    res = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    if res.returncode == 0:
        os.replace(tmp_file, src_file)
        print(f"Applied acoustic DSP to {node_id}.mp3 [{char_id}]")
    else:
        print(f"Failed to process {node_id}.mp3")

print("All acoustic DSP processing complete!")
