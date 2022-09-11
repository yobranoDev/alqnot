import time
import random

def avatar_img_config(instance, file_name):
    return time.strftime(f"avatars/{instance.user.username}/%m-%Y/{file_name}")


def background_img_config(instance, file_name):
    return time.strftime(f"backgrounds/{instance.user.username}/%m-%Y/{file_name}")

def default_bg():
    image =  random.choice([
    "bg (1).jpg",
    "bg (2).jpg",
    "bg (3).jpg",
    "bg (1).jpeg",
    "bg (2).jpeg",
    "bg (3).jpeg",
    "bg (4).jpeg",])
    
    return "default/backgrounds/" +image