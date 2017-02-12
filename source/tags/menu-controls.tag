<menu-controls>
      <div class="l-menu-controls">
          <button onclick={ open_menu }> settings </button>
      </div>

    <script>
        open_menu() {
            var menu = document.getElementById("menu");
            if(menu.className == "l-menu menu") {
                menu.className = "menu-is-open l-menu menu";
            } else {
                menu.className = "l-menu menu";
            }
        }
    </script>


</menu-controls>
