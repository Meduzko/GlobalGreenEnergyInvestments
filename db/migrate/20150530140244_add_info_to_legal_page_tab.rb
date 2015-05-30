class AddInfoToLegalPageTab < ActiveRecord::Migration
  def up
    page = Page.find_by(slug: 'legal')
    page = Page.create!(name: 'legal', status: true) if page.nil?

    default_description = '<h5>Om welke gegevens gaat het?</h5>
    <p>Wij verzamelen uitsluitend die gegevens welke nodig zijn om onze Diensten te verlenen en bewaren alle gegevens die
      u op onze Website invoert of die u aan ons verstrekt wanneer u gebruik maakt van onze Diensten. Deze gegevens
      omvatten, maar zijn niet beperkt tot:</p>
    <ul>
      <li>gegevens die u aan ons verstrekt wanneer u gebruikt maakt van onze Diensten, waaronder uw naam, leveringsadres,
        geslacht, e-mailadres, telefoonnummer, of u handelt uit naam van een bedrijf en zo ja, welk bedrijf, en
        rekeningnummer;
      </li>
      <li>aanvullende gegevens die u mogelijk aan ons verstrekt via social media, de Website of diensten van derden.</li>
    </ul>
    <p>Wij kunnen aanvullende gegevens over u ontvangen of verzamelen van derden en deze toevoegen aan de informatie die
      wij hebben verkregen, voor zover we deze nodig hebben om kwalitatief goede Diensten te kunnen verlenen, en voor
      zover toegestaan door de wet. Deze gegevens omvatten, maar zijn niet beperkt tot: demografische gegevens, gemiddeld
      energieverbruik en EDR score.</p>'.html_safe

    PageTab.create!(page_id: page.id, tab_name: 'About us', slug_ancor: 'about_us', description: default_description, status: true, position: 1)
    PageTab.create!(page_id: page.id, tab_name: 'Risks',    slug_ancor: 'risks',    description: default_description, status: true, position: 5)
    PageTab.create!(page_id: page.id, tab_name: 'Terms and conditions', slug_ancor: 'terms_and_conditions', description: default_description, status: true, position: 10)
    PageTab.create!(page_id: page.id, tab_name: 'Privacy policy', slug_ancor: 'privacy_policy', description: default_description, status: true, position: 15)
    PageTab.create!(page_id: page.id, tab_name: 'Disclaimer', slug_ancor: 'disclaimer', description: default_description, status: true, position: 20)

  end

  def down
    page = Page.find_by(slug: 'legal')
    page.destroy unless page.nil?
  end
end
